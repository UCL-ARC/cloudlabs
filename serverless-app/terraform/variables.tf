variable "aws_region" {
  description = "AWS region for all resources."
  type    = string
  default = "eu-west-2"
}

variable "s3_media_bucket_name" {
  description = "AWS S3 bucket for media files"
  type = string
}

variable "dynamodb_name" {
  description = "AWS DynamoDB"
  type = string
}

variable "backend_url" {
  description = "The URL for the web app"
  type = string
}
variable "local_storage_id" {
  description = "AWS DynamoDB"
  type = string
}
variable "cognito_userpool_id" {
  description = "Cognito Userpool ID"
  type = string
}
variable "cognito_client_id" {
  description = "Cognito Client ID"
  type = string
}

variable "local_lambda_source" {
  description = "Local path for lambda functions"
  type = string
  default = "../aws/lambda-functions"
}