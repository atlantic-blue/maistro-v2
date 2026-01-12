variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "api_name" {
  description = "API Gateway name"
  type        = string
}

variable "cors_origins" {
  description = "Allowed CORS origins"
  type        = list(string)
  default     = ["*"]
}

variable "authorizer_uri" {
  description = "Lambda authorizer URI"
  type        = string
  default     = null
}

variable "enable_jwt_authorizer" {
  description = "Enable JWT authorizer"
  type        = bool
  default     = false
}

variable "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN for JWT authorizer"
  type        = string
  default     = null
}

variable "cognito_client_id" {
  description = "Cognito Client ID for JWT authorizer"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

locals {
  full_name = "${var.project}-${var.api_name}-${var.environment}"
}

resource "aws_apigatewayv2_api" "main" {
  name          = local.full_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins     = var.cors_origins
    allow_methods     = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key"]
    expose_headers    = ["Content-Type"]
    max_age           = 300
    allow_credentials = true
  }

  tags = var.tags
}

resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = var.environment
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      integrationLatency = "$context.integrationLatency"
    })
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/apigateway/${local.full_name}"
  retention_in_days = var.environment == "prod" ? 90 : 14
  tags              = var.tags
}

resource "aws_apigatewayv2_authorizer" "jwt" {
  count            = var.enable_jwt_authorizer ? 1 : 0
  api_id           = aws_apigatewayv2_api.main.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "${local.full_name}-jwt-authorizer"

  jwt_configuration {
    audience = [var.cognito_client_id]
    issuer   = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${split("/", var.cognito_user_pool_arn)[1]}"
  }
}

data "aws_region" "current" {}

output "api_id" {
  value = aws_apigatewayv2_api.main.id
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.main.api_endpoint
}

output "stage_name" {
  value = aws_apigatewayv2_stage.main.name
}

output "authorizer_id" {
  value = var.cognito_user_pool_arn != null ? aws_apigatewayv2_authorizer.jwt[0].id : null
}

output "execution_arn" {
  value = aws_apigatewayv2_api.main.execution_arn
}
