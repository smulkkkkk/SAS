// backend-go/models/user.go
package models

import (
	"log"

	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `json:"-"`
	Name     string `json:"name"`
	Role     string `json:"role"` // admin | editor | viewer
}

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("pulseflow.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}
	if err := DB.AutoMigrate(&User{}); err != nil {
		log.Fatal("failed to migrate:", err)
	}
	seedUsers()
}

func seedUsers() {
	var count int64
	DB.Model(&User{}).Count(&count)
	if count > 0 {
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("failed to hash seed password:", err)
	}
	DB.Create(&User{
		Email:    "admin@pulseflow.com",
		Password: string(hash),
		Name:     "Admin",
		Role:     "admin",
	})
	log.Println("Seed: admin@pulseflow.com / admin123")
}
