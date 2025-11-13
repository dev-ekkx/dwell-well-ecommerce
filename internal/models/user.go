package models

type InviteUserRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Group string `json:"group"`
}

type InviteUserResponse struct {
	Message string `json:"message"`
}
