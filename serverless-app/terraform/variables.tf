variable "aws_region" {
  description = "AWS region for all resources."
  type    = string
  default = "eu-west-2"
}

variable "s3_web_bucket_name" {
  description = "AWS S3 bucket for static web site"
  type = string
}

variable "s3_media_bucket_name" {
  description = "AWS S3 bucket for media files"
  type = string
}

variable "s3_lambda_bucket_name" {
  description = "AWS S3 bucket for lambda functions"
  type = string
}

variable "dynamodb_name" {
  description = "AWS DynamoDB"
  type = string
}

variable "local_lambda_source" {
  description = "Local path for lambda functions"
  type = string
  default = "../aws/lambda-functions"
}

variable "environments" {
  type = string
  default = "dev"
}