package main

import (
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/services"
)

// the main is the entry point for the GetSKUsByPrice Lambda function.
func main() {
	// Initialize the service that contains all the business logic.
	productService, err := services.NewProductService()
	if err != nil {
		log.Fatalf("failed to initialize product service: %v", err)
	}

	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		return productService.GetSKUsByPrice(request)
	}

	lambda.Start(handler)
}
