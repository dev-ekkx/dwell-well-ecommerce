package main

import (
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/services"
)

func main() {
	productService, err := services.NewProductService()
	if err != nil {
		log.Fatalf("failed to initialize product service: %v", err)
	}

	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		fmt.Println("requests: ", request)
		return productService.GetProductStats(request)
	}
	lambda.Start(handler)
}
