package services

import (
	"context"
	"errors"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	awsClient "github.com/dev-ekkx/dwell-well-ecommerce/internal/aws"
)

const (
	ErrUserAlreadyExists = "user_already_exists"
	ErrInvalidParameter  = "invalid_parameter"
)

// UserService manages administrative operations on Cognito users.
type UserService struct {
	CognitoClient *cognitoidentityprovider.Client
	UserPoolID    string
}

// NewUserService creates a new instance of UserService using the global client.
func NewUserService() *UserService {
	// Ensure the global AWS clients are initialized
	awsClient.Init()

	return &UserService{
		CognitoClient: awsClient.CognitoClient,
		UserPoolID:    os.Getenv("USER_POOL_ID"),
	}
}

// InviteAndGroupUser calls AdminCreateUser and AdminAddUserToGroup.
func (s *UserService) InviteAndGroupUser(ctx context.Context, email string, name string, group string) error {
	log.Printf("Starting invitation for user %s to group %s...", email, group)

	// AdminCreateUser handles sending the temporary password invitation email.
	_, err := s.CognitoClient.AdminCreateUser(ctx, &cognitoidentityprovider.AdminCreateUserInput{
		UserPoolId: aws.String(s.UserPoolID),
		Username:   aws.String(email),
		UserAttributes: []types.AttributeType{
			{Name: aws.String("email"), Value: aws.String(email)},
			{Name: aws.String("name"), Value: aws.String(name)},
			{Name: aws.String("email_verified"), Value: aws.String("true")},
		},
	})

	if err != nil {
		var existsError *types.UsernameExistsException
		var invalidParamError *types.InvalidParameterException
		var notFoundError *types.ResourceNotFoundException

		if errors.As(err, &existsError) {
			// This means the user is already in the user pool.
			log.Printf("User %s already exists. Will proceed to group assignment.", email)
			// DO NOT return the error here, proceed to group assignment in case the user
			// was created, but group assignment failed previously.
		} else if errors.As(err, &invalidParamError) {
			// Handle issues like badly formatted email or missing required attributes.
			log.Printf("Invalid parameter in AdminCreateUser for %s: %v", email, invalidParamError.ErrorMessage())
			return errors.New(ErrInvalidParameter)
		} else if errors.As(err, &notFoundError) {
			// This is unlikely, but means the UserPoolID itself is invalid
			log.Printf("Cognito User Pool not found: %v", err)
			return err
		} else {
			// Handle all other unexpected errors (e.g., throttling, internal server error)
			log.Printf("Unexpected error during AdminCreateUser for %s: %v", email, err)
			return err
		}
	}

	// --- 2. ADMIN ADD USER TO GROUP ---
	_, err = s.CognitoClient.AdminAddUserToGroup(ctx, &cognitoidentityprovider.AdminAddUserToGroupInput{
		UserPoolId: aws.String(s.UserPoolID),
		Username:   aws.String(email),
		GroupName:  aws.String(group),
	})

	if err != nil {
		log.Printf("Error adding user %s to group %s: %v", email, group, err)
		return err
	}

	log.Printf("Successfully invited user %s and assigned to group %s.", email, group)
	return nil
}
