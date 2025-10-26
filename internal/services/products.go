package services

import (
	"encoding/json"
	"log"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/db"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/models"
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

func (s *ProductService) GetSKUsByPrice(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// 1. Parse minPrice from query string parameters
	minPriceStr, ok := request.QueryStringParameters["minPrice"]
	if !ok {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Missing minPrice parameter"}, nil
	}
	minPrice, err := strconv.ParseFloat(minPriceStr, 64)
	if err != nil {
		log.Printf("ERROR: Invalid minPrice parameter '%s': %v", minPriceStr, err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid minPrice parameter"}, nil
	}

	// 2. Parse maxPrice from query string parameters
	maxPriceStr, ok := request.QueryStringParameters["maxPrice"]
	if !ok {
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Missing maxPrice parameter"}, nil
	}
	maxPrice, err := strconv.ParseFloat(maxPriceStr, 64)
	if err != nil {
		log.Printf("ERROR: Invalid maxPrice parameter '%s': %v", maxPriceStr, err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid maxPrice parameter"}, nil
	}

	// 3. Call the database layer to perform the scan and get the SKUs
	skus, err := s.dynamoDB.GetProductSKUsByPriceRange(minPrice, maxPrice)
	if err != nil {
		log.Printf("ERROR: getting SKUs by price from DynamoDB: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching data"}, nil
	}

	// 4. Marshal the resulting SKU slice into JSON
	responseBody, err := json.Marshal(skus)
	if err != nil {
		log.Printf("ERROR: marshalling SKUs response: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error creating response"}, nil
	}

	// 5. Return the successful response
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(responseBody),
	}, nil
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

// List all products
func (s *ProductService) GetAllProducts() (events.APIGatewayProxyResponse, error) {
	products, err := s.dynamoDB
}
