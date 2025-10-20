package main

import (
	"backend/internal/services"
	"log"
)

func main() {
	webhookService, err := services.NewWebhookService()
	if err != nil {
		log.Fatalf("failed to initialize webhook service: %v", err)
	}

	// The handler calls the specific method on the service.
	handler := func(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		return webhookService.HandleStrapiProductPublish(request)
	}

	lambda.Start(handler)
}
