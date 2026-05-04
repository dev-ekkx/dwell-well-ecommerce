package models

type Product struct {
	SKU           string  `json:"sku" dynamodbav:"sku"`
	ProductStatus string  `json:"productStatus" dynamodbav:"productStatus"`
	OldPrice      float64 `json:"oldPrice,omitempty" dynamodbav:"oldPrice,omitempty"`
	Price         float64 `json:"price" dynamodbav:"price"`
	Inventory     int     `json:"inventory" dynamodbav:"inventory"`
	AverageRating float64 `json:"averageRating" dynamodbav:"averageRating"`
	ReviewCount   int     `json:"reviewCount" dynamodbav:"reviewCount"`
}

type GetProductsRequest struct {
	SKUs []string `json:"skus"`
}

type UpdateProductInventoryRequest struct {
	SKU       string  `json:"sku"`
	Inventory int     `json:"inventory"`
	Price     float64 `json:"price"`
}
