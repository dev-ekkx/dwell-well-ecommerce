package aws

import (
	"context"
	"log"
	"os"
	"sync"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/eventbridge"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
)

var (
	cfg          aws.Config
	once         sync.Once
	DynamoClient *dynamodb.Client
	SQSClient    *sqs.Client
	EventClient  *eventbridge.Client
)

// Init initializes the AWS configuration and all service clients as singletons.
// The sync.Once ensures this logic runs only one time per Lambda cold start.
func Init() {
	once.Do(func() {
		var err error
		region := os.Getenv("AWS_REGION")
		if region == "" {
			region = "us-east-1"
		}

		cfg, err = config.LoadDefaultConfig(context.TODO(),
			config.WithRegion(region),
		)
		if err != nil {
			log.Fatalf("unable to load AWS SDK config: %v", err)
		}

		DynamoClient = dynamodb.NewFromConfig(cfg)
		SQSClient = sqs.NewFromConfig(cfg)
		EventClient = eventbridge.NewFromConfig(cfg)
	})
}

// GetConfig provides access to the loaded AWS config if needed elsewhere.
func GetConfig() (aws.Config, error) {
	Init()                // Ensure initialization has run
	if cfg.Region == "" { // Check if cfg is initialized properly, error might have occurred in init
		return aws.Config{}, err // Return the potential error from init
	}
	return cfg, nil
}
