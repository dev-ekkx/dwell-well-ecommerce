package main

import (
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/services"
)

func main() {
	// 2. Call NewProductService() here, at the very beginning.
	// This creates an instance of your ProductService and injects
	// all its dependencies (like the DynamoDB client).
	productService, err := services.NewProductService()
	if err != nil {
		// If the service can't be created (e.g., AWS config fails),
		// the Lambda will fail to start.
		log.Fatalf("failed to initialize product service: %v", err)
	}

	// 3. Define the handler. This is the code that will run for every request.
	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		return productService.GetProducts(request)
	}

	// 4. Start the Lambda listener with the handler.
	lambda.Start(handler)
}
