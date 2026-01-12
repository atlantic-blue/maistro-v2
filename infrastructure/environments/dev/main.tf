terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "abs-terraform"
    key            = "maistro-v2/dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "maistro-terraform-locks"
    profile = "atlantic-blue"
  }
}

provider "aws" {
  region = var.aws_region
  profile = var.aws_account

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

locals {
  common_tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# DynamoDB Table
module "dynamodb" {
  source = "../../modules/dynamodb"

  project        = var.project
  environment    = var.environment
  table_name     = "main"
  enable_streams = true

  tags = local.common_tags
}

# Cognito User Pool
module "cognito" {
  source = "../../modules/cognito"

  project       = var.project
  environment   = var.environment
  pool_name     = "users"
  domain_prefix = var.project

  callback_urls = [
    "http://localhost:3000/auth/callback",
    "https://${var.app_domain}/auth/callback",
  ]

  logout_urls = [
    "http://localhost:3000",
    "https://${var.app_domain}",
  ]

  tags = local.common_tags
}

# S3 Bucket for Landing Pages
module "landing_pages_bucket" {
  source = "../../modules/s3"

  project        = var.project
  environment    = var.environment
  bucket_name    = "landing-pages"
  enable_website = true

  cors_allowed_origins = ["*"]

  tags = local.common_tags
}

# CloudFront for Landing Pages
module "landing_pages_cdn" {
  source = "../../modules/cloudfront"

  project               = var.project
  environment           = var.environment
  distribution_name     = "landing-pages"
  s3_bucket_domain_name = module.landing_pages_bucket.bucket_regional_domain_name
  s3_bucket_arn         = module.landing_pages_bucket.bucket_arn

  tags = local.common_tags
}

# API Gateway
module "api_gateway" {
  source = "../../modules/api-gateway"

  project     = var.project
  environment = var.environment
  api_name    = "main"

  cors_origins = [
    "http://localhost:3000",
    "https://${var.app_domain}",
  ]

  cognito_user_pool_arn = module.cognito.user_pool_arn
  cognito_client_id     = module.cognito.client_id
  enable_jwt_authorizer = true

  tags = local.common_tags
}

# S3 Bucket Policy for CloudFront
resource "aws_s3_bucket_policy" "landing_pages" {
  bucket = module.landing_pages_bucket.bucket_name
  policy = module.landing_pages_cdn.s3_bucket_policy_json
}
