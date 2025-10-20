package db

import (
	"context"
	"dwell-well-ecommerce/internal/aws"
	"dwell-well-ecommerce/internal/models"
	"errors"
	"fmt"
	"log"
	"os"

	awsSDK "github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
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
		Price:         0,
		OldPrice:      0,
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
			log.Printf("ERROR: Failed to put item in DynamoDB: %v", err)
			return err
		}
		log.Printf("INFO: Product with SKU '%s' already exists. No action taken.", sku)
	} else {
		log.Printf("INFO: Successfully created new product with SKU '%s' in DynamoDB.", sku)
	}

	return nil
}

// GetProductsBySKUs performs a BatchGetItem to fetch multiple products.
func (d *DynamoDBClient) GetProductsBySKUs(skus []string) ([]models.Product, error) {
	if len(skus) == 0 {
		return []models.Product{}, nil
	}

	keys := make([]map[string]types.AttributeValue, len(skus))
	for i, sku := range skus {
		keys[i] = map[string]types.AttributeValue{
			"sku": &types.AttributeValueMemberS{Value: sku},
		}
	}

	input := &dynamodb.BatchGetItemInput{
		RequestItems: map[string]types.KeysAndAttributes{
			d.tableName: {
				Keys: keys,
			},
		},
	}

	result, err := d.client.BatchGetItem(context.TODO(), input)
	if err != nil {
		return nil, err
	}

	var products []models.Product
	// Ensure result.Responses are not nil and the table name exists
	if result.Responses == nil || len(result.Responses[d.tableName]) == 0 {
		return []models.Product{}, nil
	}

	err = attributevalue.UnmarshalListOfMaps(result.Responses[d.tableName], &products)
	if err != nil {
		return nil, err
	}

	return products, nil
}
