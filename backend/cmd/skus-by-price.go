package main

import (
	"dwell-well-ecommerce/internal/services"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// main is the entry point for the GetSKUsByPrice Lambda function.
func main() {
	// Initialize the service that contains all the business logic.
	productService, err := services.NewProductService()
	if err != nil {
		log.Fatalf("failed to initialize product service: %v", err)
	}

	// The handler calls the specific method on the service
	// to process the price filter request.
	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		return productService.GetSKUsByPrice(request)
	}

	lambda.Start(handler)
}
