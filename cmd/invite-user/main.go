package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/auth"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/models"
	"github.com/dev-ekkx/dwell-well-ecommerce/internal/services"
)

var userService services.UserService

func inviteUserLogic(ctx context.Context, request events.APIGatewayProxyRequest, adminUserID string) (events.APIGatewayProxyResponse, error) {

	var payload models.InviteUserRequest
	if err := json.Unmarshal([]byte(request.Body), &payload); err != nil {
		log.Printf("Invalid request body from admin %s: %v", adminUserID, err)
		return events.APIGatewayProxyResponse{StatusCode: 400, Body: "Invalid Request Body"}, nil
	}

	// Simple validation to ensure the group is one of the allowed admin groups
	if payload.Email == "" || (payload.Group != "admin" && payload.Group != "subAdmin") {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Missing email or invalid group. Group must be 'admin' or 'subAdmin'."}, nil
	}

	// Execute Business Logic via the Service Layer
	err := userService.InviteAndGroupUser(ctx, payload.Email, payload.Name, payload.Group)

	if err != nil {
		log.Printf("Admin %s failed to invite user %s: %v", adminUserID, payload.Email, err)

		// Check for Invalid Parameter (400 Bad Request)
		if errors.Is(err, errors.New(services.ErrInvalidParameter)) {
			return events.APIGatewayProxyResponse{
				StatusCode: 400,
				Body:       "Invalid input provided (e.g., malformed email or missing required attributes).",
			}, nil
		}

		// Fallback to Generic Internal Server Error (500)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "An internal server error occurred during the invitation process.",
		}, nil
	}

	// Success Response
	responseBody, _ := json.Marshal(models.InviteUserResponse{
		Message: "User invitation sent and user assigned to group successfully.",
	})

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(responseBody),
	}, nil
}

func main() {
	lambda.Start(auth.RequireGroup("admin", inviteUserLogic))
}
