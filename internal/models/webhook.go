package models

type WebhookPayload struct {
	Event string `json:"event"`
	Model string `json:"model"`
	Entry struct {
		SKU string `json:"sku"`
	} `json:"entry"`
}
