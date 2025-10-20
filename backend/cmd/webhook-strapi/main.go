package main

import (
	"backend/internal/services"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	// Initialize the service that contains all the business logic.
	webhookService, err := services.NewWebhookService()
	if err != nil {
		log.Fatalf("failed to initialize webhook service: %v", err)
	}

	// Strapi webhook handler function
	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		return webhookService.HandleStrapiProductPublish(request)
	}

	lambda.Start(handler)
}
