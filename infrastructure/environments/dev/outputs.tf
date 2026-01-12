output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = module.dynamodb.table_arn
}

output "dynamodb_access_policy_arn" {
  description = "DynamoDB access policy ARN"
  value       = module.dynamodb.access_policy_arn
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = module.cognito.user_pool_arn
}

output "cognito_client_id" {
  description = "Cognito Client ID"
  value       = module.cognito.client_id
}

output "cognito_domain" {
  description = "Cognito domain"
  value       = module.cognito.domain
}

output "cognito_endpoint" {
  description = "Cognito endpoint"
  value       = module.cognito.endpoint
}

output "landing_pages_bucket_name" {
  description = "Landing pages S3 bucket name"
  value       = module.landing_pages_bucket.bucket_name
}

output "landing_pages_bucket_arn" {
  description = "Landing pages S3 bucket ARN"
  value       = module.landing_pages_bucket.bucket_arn
}

output "landing_pages_cdn_domain" {
  description = "Landing pages CloudFront domain"
  value       = module.landing_pages_cdn.domain_name
}

output "landing_pages_cdn_distribution_id" {
  description = "Landing pages CloudFront distribution ID"
  value       = module.landing_pages_cdn.distribution_id
}

output "api_gateway_endpoint" {
  description = "API Gateway endpoint"
  value       = module.api_gateway.api_endpoint
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = module.api_gateway.api_id
}

output "api_gateway_authorizer_id" {
  description = "API Gateway authorizer ID"
  value       = module.api_gateway.authorizer_id
}
