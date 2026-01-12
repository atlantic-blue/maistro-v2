variable "project" {
  description = "Project name"
  type        = string
  default     = "maistro-v2"
}

variable "aws_account" {
  default = "atlantic-blue"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "app_domain" {
  description = "Application domain"
  type        = string
  default     = "dev.maistroapp.com"
}

variable "landing_domain" {
  description = "Landing pages domain"
  type        = string
  default     = "maistro.live"
}
