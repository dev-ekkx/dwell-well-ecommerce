package services

import (
	"dwell-well-ecommerce/backend/internal/db"
	"dwell-well-ecommerce/backend/internal/models"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

// WebhookService encapsulates logic for handling incoming webhooks.
type WebhookService struct {
	dynamoDB db.DynamoDBClient
}

// NewWebhookService creates a new webhook service.
func NewWebhookService() (*WebhookService, error) {
	d, err := db.NewClient()
	if err != nil {
		return nil, err
	}
	return &WebhookService{dynamoDB: *d}, nil
}

func (s *WebhookService) HandleStrapiProductPublish(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var payload models.WebhookPayload
	err := json.Unmarshal([]byte(request.Body), &payload)
	if err != nil {
		log.Printf("ERROR: Failed to unmarshal Strapi webhook payload: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid payload"}, nil
	}

	// We only care about publish events for the product model that have a SKU.
	if payload.Event != "entry.publish" || payload.Model != "product" || payload.Entry.SKU == "" {
		log.Printf("INFO: Ignoring webhook event: %s for model: %s", payload.Event, payload.Model)
		return events.APIGatewayProxyResponse{StatusCode: 200, Body: "Event ignored"}, nil
	}

	log.Printf("INFO: Processing publish event for SKU: %s", payload.Entry.SKU)

	// Call the database function to create the product with default values.
	err = s.dynamoDB.CreateOrUpdateProductDefaults(payload.Entry.SKU)
	if err != nil {
		log.Printf("ERROR: Failed to create/update product in DynamoDB for SKU %s: %v", payload.Entry.SKU, err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Failed to process event"}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: 200, Body: "Product processed successfully"}, nil
}
