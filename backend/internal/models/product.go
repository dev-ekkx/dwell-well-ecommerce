package models

type Product struct {
	SKU           string  `json:"sku" dynamodbav:"sku"`
	OldPrice      float64 `json:"oldPrice,omitempty" dynamodbav:"oldPrice,omitempty"`
	Price         float64 `json:"price" dynamodbav:"price"`
	Inventory     int     `json:"inventory" dynamodbav:"inventory"`
	AverageRating float64 `json:"averageRating" dynamodbav:"averageRating"`
	ReviewCount   int     `json:"reviewCount" dynamodbav:"reviewCount"`
}
