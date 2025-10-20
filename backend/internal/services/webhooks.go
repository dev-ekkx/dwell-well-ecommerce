package services

import (
	"dwell-well-ecommerce/internal/db"
	"dwell-well-ecommerce/internal/models"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

// WebhookService encapsulates all business logic for handling incoming webhooks.
type WebhookService struct {
	dynamoDB db.DynamoDBClient
}

// NewWebhookService creates a new webhook service with its dependencies.
func NewWebhookService() (*WebhookService, error) {
	d, err := db.NewClient()
	if err != nil {
		return nil, err
	}
	return &WebhookService{dynamoDB: *d}, nil
}

// HandleStrapiProductPublish is the specific handler for product creation/update events from Strapi.
func (s *WebhookService) HandleStrapiProductPublish(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	//const expectedSignature = "YOUR_SECRET_TOKEN" // This should come from a secure source like AWS Secrets Manager
	//
	//signature := request.Headers["x-strapi-signature"] // Headers are case-insensitive
	//
	//if signature != expectedSignature {
	//	log.Println("ERROR: Invalid Strapi signature received.")
	//	return events.APIGatewayProxyResponse{StatusCode: 401, Body: "Unauthorized"}, nil
	//}

	var payload models.WebhookPayload
	err := json.Unmarshal([]byte(request.Body), &payload)
	if err != nil {
		log.Printf("ERROR: Failed to unmarshal Strapi webhook payload: %v", err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid payload"}, nil
	}

	// Only care about publish events for the 'product' model that have a non-empty SKU.
	if payload.Event != "entry.publish" || payload.Model != "product" || payload.Entry.SKU == "" {
		log.Printf("INFO: Ignoring webhook event: %s for model: %s. SKU: '%s'", payload.Event, payload.Model, payload.Entry.SKU)
		return events.APIGatewayProxyResponse{StatusCode: 200, Body: "Event ignored as it's not a product publish event"}, nil
	}

	log.Printf("INFO: Processing publish event for SKU: %s", payload.Entry.SKU)

	// Call the database function to create the product with default values.
	// This function is idempotent, so it's safe if Strapi sends the same event multiple times.
	err = s.dynamoDB.CreateProductWithDefaults(payload.Entry.SKU)
	if err != nil {
		log.Printf("ERROR: Failed to create/update product in DynamoDB for SKU %s: %v", payload.Entry.SKU, err)
		return events.APIGatewayProxyResponse{StatusCode: 500, Body: "Failed to process event"}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: 200, Body: "Product processed successfully"}, nil
}
