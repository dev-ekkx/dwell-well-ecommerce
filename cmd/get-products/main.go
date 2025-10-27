package main

import (
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/services"
)

func main() {

	// Create an instance of your ProductService and injects its dependencies (like the DynamoDB client).
	productService, err := services.NewProductService()
	if err != nil {
		// If the service can't be created (e.g., AWS config fails),
		// the Lambda will fail to start.
		log.Fatalf("failed to initialize product service: %v", err)
	}

	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		return productService.GetProducts(request)
	}
	lambda.Start(handler)
}
