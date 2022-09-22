variable "aws_region" {
  description = "AWS region for all resources."

  type    = string
  default = "eu-west-2"
}

variable "local_lambda_source" {
  description = "Local path for lambda functions"
  type = string
  default = "../aws/lambda-functions"
}