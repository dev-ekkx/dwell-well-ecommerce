package auth

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
)

type AuthorizedHandler func(ctx context.Context, request events.APIGatewayProxyRequest, userID string) (events.APIGatewayProxyResponse, error)

// RequireGroup is a middleware/decorator that ensures the user belongs to the required group.
func RequireGroup(requiredGroup string, next AuthorizedHandler) func(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// Returns the actual Lambda handler function signature
	return func(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

		// 1. Extract Claims
		claims, ok := request.RequestContext.Authorizer["claims"].(map[string]interface{})
		if !ok {
			return events.APIGatewayProxyResponse{StatusCode: 401, Body: "Unauthorized: Missing authorization context"}, nil
		}

		// 2. Get User ID (sub)
		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			return events.APIGatewayProxyResponse{StatusCode: 401, Body: "Unauthorized: User ID missing"}, nil
		}

		// 3. Get Groups Claim
		groupsInterface, groupsFound := claims["cognito:groups"]
		if !groupsFound {
			log.Printf("User %s is missing group claim.", userID)
			return events.APIGatewayProxyResponse{StatusCode: 403, Body: "Forbidden: User is not assigned to any group."}, nil
		}

		// 4. Check if the required group is present
		groups, ok := groupsInterface.([]interface{})
		if !ok {
			log.Printf("User %s group claim is in unexpected format.", userID)
			return events.APIGatewayProxyResponse{StatusCode: 403, Body: "Forbidden"}, nil
		}

		isAuthorized := false
		for _, group := range groups {
			if group == requiredGroup {
				isAuthorized = true
				break
			}
		}

		if !isAuthorized {
			log.Printf("User %s is in groups: %v, but required group is %s", userID, groups, requiredGroup)
			return events.APIGatewayProxyResponse{StatusCode: 403, Body: "Forbidden: Insufficient permissions"}, nil
		}

		// 5. If authorized, execute the actual business logic handler (passing the userID directly)
		return next(ctx, request, userID)
	}
}
