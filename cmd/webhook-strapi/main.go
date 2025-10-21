package main

import (
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/services"
)

func main() {
	// Initialize the service that contains all the business logic.
	webhookService, err := services.NewWebhookService()
	if err != nil {
		log.Fatalf("failed to initialize webhook service: %v", err)
	}

	// Strapi webhook handler function
	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		return webhookService.HandleStrapiEvent(request)
	}

	lambda.Start(handler)
}
