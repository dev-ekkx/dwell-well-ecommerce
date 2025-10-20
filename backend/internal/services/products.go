package services

import (
	"dwell-well-ecommerce/internal/db"
	"dwell-well-ecommerce/internal/models"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

// ProductService encapsulates all business logic related to products.
type ProductService struct {
	dynamoDB db.DynamoDBClient // Dependency on the DynamoDB client
}

// NewProductService creates a new product service with its dependencies.
func NewProductService() (*ProductService, error) {
	d, err := db.NewClient()
	if err != nil {
		return nil, err
	}
	return &ProductService{dynamoDB: *d}, nil
}

// GetProducts is the handler method for fetching operational data for a list of SKUs.
func (s *ProductService) GetProducts(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var body models.GetProductsRequest
	err := json.Unmarshal([]byte(request.Body), &body)
	if err != nil {
		log.Printf("ERROR: unmarshalling request body: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid request body"}, nil
	}

	if len(body.SKUs) == 0 {
		return events.APIGatewayProxyResponse{StatusCode: 200, Body: "{}"}, nil
	}

	// The database logic is abstracted away in the db package.
	products, err := s.dynamoDB.GetProductsBySKUs(body.SKUs)
	if err != nil {
		log.Printf("ERROR: getting items from DynamoDB: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching data"}, nil
	}

	// Convert the slice of products into a map for easy lookup by the frontend
	responseMap := make(map[string]models.Product)
	for _, p := range products {
		responseMap[p.SKU] = p
	}

	responseBody, err := json.Marshal(responseMap)
	if err != nil {
		log.Printf("ERROR: marshalling response: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error creating response"}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(responseBody),
	}, nil
}
