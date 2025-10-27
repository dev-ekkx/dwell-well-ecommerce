package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"

	awsSDK "github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/aws"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/models"
)

// DynamoDBClient holds the client for interacting with DynamoDB.
type DynamoDBClient struct {
	client    *dynamodb.Client
	tableName string
}

// NewClient creates a new DynamoDB client. It ensures the shared AWS clients are initialized.
func NewClient() (*DynamoDBClient, error) {
	// Initialize the shared AWS clients.
	// The sync.Once inside Init() ensures this only runs once.
	aws.Init()

	// Get the table name from environment variables
	tableName := os.Getenv("PRODUCTS_TABLE_NAME")
	if tableName == "" {
		return nil, errors.New("PRODUCTS_TABLE_NAME environment variable not set")
	}

	// Use the initialized global client from the aws package
	return &DynamoDBClient{client: aws.DynamoClient, tableName: tableName}, nil
}

// CreateProductWithDefaults creates a new product in the operational DB with default values.
func (d *DynamoDBClient) CreateProductWithDefaults(sku string) error {
	product := models.Product{
		SKU:           sku,
		ProductStatus: "ACTIVE",
		Price:         0,
		Inventory:     0,
		AverageRating: 0,
		ReviewCount:   0,
	}

	item, err := attributevalue.MarshalMap(product)
	if err != nil {
		return fmt.Errorf("ERROR: Failed to marshal product for DynamoDB: %v", err)
	}

	input := &dynamodb.PutItemInput{
		TableName:           awsSDK.String(d.tableName),
		Item:                item,
		ConditionExpression: awsSDK.String("attribute_not_exists(sku)"),
	}

	_, err = d.client.PutItem(context.TODO(), input)

	if err != nil {
		var conditionalCheckFailedException *types.ConditionalCheckFailedException
		if !errors.As(err, &conditionalCheckFailedException) {
			return err
		}
		log.Printf("INFO: Product with SKU '%s' already exists. No action taken.", sku)
	} else {
		log.Printf("INFO: Successfully created new product with SKU '%s' in DynamoDB.", sku)
	}

	return nil
}

// UpdateProductStatus updates the 'productStatus' attribute for a given SKU.
func (d *DynamoDBClient) UpdateProductStatus(sku string, newStatus string) error {
	key, err := attributevalue.MarshalMap(map[string]string{"sku": sku})
	if err != nil {
		log.Printf("ERROR: Failed to marshal key for UpdateProductStatus: %v", err)
		return err
	}

	updateExpression := "SET productStatus = :newStatus"
	expressionAttributeValues, err := attributevalue.MarshalMap(map[string]string{":newStatus": newStatus})
	if err != nil {
		log.Printf("ERROR: Failed to marshal attribute values for UpdateProductStatus: %v", err)
		return err
	}

	// Use a condition expression to only update the item if it already exists.
	input := &dynamodb.UpdateItemInput{
		TableName:                 awsSDK.String(d.tableName),
		Key:                       key,
		UpdateExpression:          awsSDK.String(updateExpression),
		ExpressionAttributeValues: expressionAttributeValues,
		ConditionExpression:       awsSDK.String("attribute_exists(sku)"), // Only update if product exists
	}

	_, err = d.client.UpdateItem(context.TODO(), input)

	if err != nil {
		// If the condition fails, it's not a true error; the product just doesn't exist.
		var conditionalCheckFailedException *types.ConditionalCheckFailedException
		if errors.As(err, &conditionalCheckFailedException) {
			log.Printf("INFO: Product with SKU '%s' not found for status update. No action taken.", sku)
			return nil
		}
		log.Printf("ERROR: Failed to update status for SKU %s: %v", sku, err)
		return err
	}

	log.Printf("INFO: Successfully updated status to '%s' for SKU '%s'.", newStatus, sku)
	return nil
}

// GetProductsBySKUs performs a BatchGetItem to fetch multiple products.
//func (d *DynamoDBClient) GetProductsBySKUs(skus []string) ([]models.Product, error) {
//	if len(skus) == 0 {
//		return []models.Product{}, nil
//	}
//
//	keys := make([]map[string]types.AttributeValue, len(skus))
//	for i, sku := range skus {
//		keys[i] = map[string]types.AttributeValue{
//			"sku": &types.AttributeValueMemberS{Value: sku},
//		}
//	}
//
//	input := &dynamodb.BatchGetItemInput{
//		RequestItems: map[string]types.KeysAndAttributes{
//			d.tableName: {
//				Keys: keys,
//			},
//		},
//	}
//
//	result, err := d.client.BatchGetItem(context.TODO(), input)
//	if err != nil {
//		return nil, err
//	}
//
//	var products []models.Product
//	// Ensure result.Responses are not nil and the table name exists
//	if result.Responses == nil || len(result.Responses[d.tableName]) == 0 {
//		return []models.Product{}, nil
//	}
//
//	err = attributevalue.UnmarshalListOfMaps(result.Responses[d.tableName], &products)
//	if err != nil {
//		return nil, err
//	}
//
//	return products, nil
//}

func (d *DynamoDBClient) GetProductsBySKUs(skus []string) ([]models.Product, error) {
	if len(skus) == 0 {
		return []models.Product{}, nil
	}

	const batchSize = 100 // DynamoDB BatchGetItem limit
	var allProducts []models.Product

	for start := 0; start < len(skus); start += batchSize {
		end := start + batchSize
		if end > len(skus) {
			end = len(skus)
		}
		batchSKUs := skus[start:end]

		// Prepare keys for this batch
		keys := make([]map[string]types.AttributeValue, len(batchSKUs))
		for i, sku := range batchSKUs {
			keys[i] = map[string]types.AttributeValue{
				"sku": &types.AttributeValueMemberS{Value: sku},
			}
		}

		input := &dynamodb.BatchGetItemInput{
			RequestItems: map[string]types.KeysAndAttributes{
				d.tableName: {Keys: keys},
			},
		}

		// Handle unprocessed keys automatically
		for len(input.RequestItems) > 0 {
			result, err := d.client.BatchGetItem(context.TODO(), input)
			if err != nil {
				return nil, err
			}

			if resp, ok := result.Responses[d.tableName]; ok {
				var products []models.Product
				err = attributevalue.UnmarshalListOfMaps(resp, &products)
				if err != nil {
					return nil, err
				}
				allProducts = append(allProducts, products...)
			}

			// Retry unprocessed keys
			input.RequestItems = result.UnprocessedKeys
		}
	}

	return allProducts, nil
}

func (d *DynamoDBClient) GetProductSKUsByPriceRange(minPrice, maxPrice float64) ([]string, error) {
	var skus []string
	var exclusiveStartKey map[string]types.AttributeValue
	productStatusValue := "ACTIVE"

	// Use a loop to handle potential pagination from the Query operation
	for {
		input := &dynamodb.QueryInput{
			TableName: awsSDK.String(d.tableName),
			IndexName: awsSDK.String("StatusPriceIndex"), // Target the GSI
			// Query HASH key exactly and RANGE key (price) with BETWEEN
			KeyConditionExpression: awsSDK.String("productStatus = :statusVal AND price BETWEEN :minPrice AND :maxPrice"),
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":statusVal": &types.AttributeValueMemberS{Value: productStatusValue},
				":minPrice":  &types.AttributeValueMemberN{Value: strconv.FormatFloat(minPrice, 'f', -1, 64)},
				":maxPrice":  &types.AttributeValueMemberN{Value: strconv.FormatFloat(maxPrice, 'f', -1, 64)},
			},
			// Only retrieve the 'sku' attribute to minimize read cost
			ProjectionExpression: awsSDK.String("sku"),
			ExclusiveStartKey:    exclusiveStartKey,
		}

		// Execute the Query operation
		result, err := d.client.Query(context.TODO(), input)
		if err != nil {
			log.Printf("ERROR: Failed to query StatusPriceIndex GSI: %v", err)
			return nil, err
		}

		// Unmarshal the 'sku' from each returned item
		for _, item := range result.Items {
			var productSKU struct {
				SKU string `dynamodbav:"sku"`
			}
			err := attributevalue.UnmarshalMap(item, &productSKU)
			if err == nil && productSKU.SKU != "" {
				skus = append(skus, productSKU.SKU)
			} else if err != nil {
				log.Printf("WARN: Failed to unmarshal SKU from GSI item: %v", err)
			}
		}

		// Check if there are more items to fetch
		if result.LastEvaluatedKey == nil {
			break // Exit loop if all items have been read
		}
		exclusiveStartKey = result.LastEvaluatedKey // Set the start key for the next page
	}

	return skus, nil
}
