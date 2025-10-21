package models

import "time"

type Order struct {
	OrderID     string      `json:"orderId"`
	CustomerID  string      `json:"customerId"`
	Status      string      `json:"status"`
	CreatedAt   time.Time   `json:"createdAt"`
	UpdatedAt   time.Time   `json:"updatedAt"`
	Items       []OrderItem `json:"items"`
	TotalAmount float64     `json:"totalAmount"`
}

type OrderItem struct {
	ProductID string  `json:"productId"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}
