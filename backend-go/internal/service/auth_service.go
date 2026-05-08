// Purpose 
// This layer contains:
//  Business logic
//  Password hashing
//  Validation
//  JWT generation

package service

import (
	"errors"
	
	"golang.org/x/crypto/bcrypt"

	"github.com/lanora/backend/internal/models"
	"github.com/lanora/backend/internal/repository"
	"github.com/lanora/backend/internal/utils"
)

type AuthService struct {
	userRepo *repository.UserRepository
	jwtSecret string
}

func NewAuthService(
	userRepo *repository.UserRepository,
	jwtSecret string,
) *AuthService {

	return &AuthService{
		userRepo: userRepo,
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) Register(
	req *models.RegisterRequest,
) (*models.AuthResponse, error) {

	// check existing user
	_, err := s.userRepo.GetUserByEmail(req.Email)

	if err == nil {
		return nil, errors.New("user already exists")
	}

	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return nil, err
	}

	user := &models.User{
		Name: req.Name,
		Email: req.Email,
		Password: string(hashedPassword),
	}

	err = s.userRepo.CreateUser(user)

	if err != nil {
		return nil, err
	}

	token, err := utils.GenerateJWT(
		user.ID,
		s.jwtSecret,
	)

	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Token: token,
		User: *user,
	}, nil
}

func (s *AuthService) Login(
	req *models.LoginRequest,
) (*models.AuthResponse, error) {

	user, err := s.userRepo.GetUserByEmail(req.Email)

	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(req.Password),
	)

	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWT(
		user.ID,
		s.jwtSecret,
	)

	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		Token: token,
		User: *user,
	}, nil
}

// SERVICE DOES NOT:
//  Decode JSON
//  Write HTTP response
//  Execute SQL directly