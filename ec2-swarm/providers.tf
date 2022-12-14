# Enforce minimum Terraform and AWS provider version numbers.
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.24.0"
    }
  }

  required_version = ">= 1.0.6"
}