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
	dynamoDB db.DynamoDBClient
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

// UpdateProductPrice is the handler method for updating the price of a single product.
func (s *ProductService) UpdateProductPrice(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var body models.UpdateProductPriceRequest
	err := json.Unmarshal([]byte(request.Body), &body)
	if err != nil {
		log.Printf("ERROR: unmarshalling request body: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid request body"}, nil
	}

	// The database logic is abstracted away in the db package.
	products, err := s.dynamoDB.UpdateProductPrice(body.SKU, body.Price)
	if err != nil {
		log.Printf("ERROR: updating item in DynamoDB: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error updating data"}, nil
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

// GetProductStats returns aggregated product statistics.
func (s *ProductService) GetProductStats(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// 1. Get Total Products
	totalProducts, err := s.dynamoDB.GetTotalProductsCount()
	if err != nil {
		log.Printf("ERROR: getting total products count: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching total products"}, nil
	}

	// 2. Get Available Stock
	totalStock, err := s.dynamoDB.GetTotalInventoryCount()
	if err != nil {
		log.Printf("ERROR: getting total inventory count: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching total stock"}, nil
	}

	// 3. Get Pending Items
	pendingItems, err := s.dynamoDB.GetPendingProducts()
	if err != nil {
		log.Printf("ERROR: getting pending products: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching pending items"}, nil
	}

	// 4. Get Low Stock Alert
	threshold := 10 // Default threshold
	if tStr, ok := request.QueryStringParameters["threshold"]; ok {
		if t, err := strconv.Atoi(tStr); err == nil {
			threshold = t
		}
	}
	lowStockItems, err := s.dynamoDB.GetLowStockProducts(threshold)
	if err != nil {
		log.Printf("ERROR: getting low stock products: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Error fetching low stock items"}, nil
	}

	// Construct response
	response := map[string]interface{}{
		"totalProducts":  totalProducts,
		"totalStock":     totalStock,
		"pendingPricing": pendingItems,
		"lowStockAlert":  lowStockItems,
	}

	responseBody, _ := json.Marshal(response)
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(responseBody),
	}, nil
}
