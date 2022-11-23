terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = "~> 1.0"
}

provider "aws" {
  profile = "default"
  region  = var.aws_region
}

### DYNAMODB 
### This defines the single table in DynamoDB. Note: only the hash_key and the range_key (if used)
### must be declared in this resource. All additional attributes will be automatically declared when
### writing to/reading from the table. 
### If a global/local index is used, this must be declared as well (and the associated attributes with it)


resource "aws_dynamodb_table" "user-places-table" {
  name           = var.dynamodb_name
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "UserId"
  range_key      = "MediaFileName"

  attribute {
    name = "UserId"
    type = "S"
  }
  attribute {
    name = "MediaFileName"
    type = "S"
  }
}


### SECTION FOR DECLARING S3 Buckets  
### S3 is used to store and run the lambda functions
### --> see file s3buckets.tf in this directory

### SECTION FOR DECLARING LAMBDA FUNCTIONS AND THEIR ROLES
### there are 2 lambda functions
### a.) the first to handle user authentication
### b.) the second to handle API request
### ALL API calls and methods (GET,POST, DELETE, PATCH) require authentication 
### --> see file lambdas.tf in this directory


### AWS Cognito
### we define a User pool based on using email as a login mechanism
### This section is poorly documented in terraform and it may be tricky to map it to the values in AWS console
### some terraform attributes/values listed below are optional, but I thought I call them out for clarity
### The code below maps to the following settings in AWS Cognito
### 1.) attributes: Username: 'also allow sign in with verified email address'
###   - Enable case insensitivity for username input
###   - Which standard attributes are required? email (see schema section below)
### 2.) Policies: minimum password length = 6
###   - users can sign themselves up (admin_create_user_config)
### 3.) MFA and verifications
###   - MFA is off
###   - email for account recovery
###   - email as attribute to recover

resource "aws_cognito_user_pool" "example_ucl_user_pool" {
  name = "example_ucl_user_pool"  
  username_attributes = ["email"]

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  username_configuration {
    case_sensitive = false
  }
  schema {
    attribute_data_type = "String"
    mutable = true
    name = "email"
    required = true
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  password_policy {
    minimum_length = 6
  }

  mfa_configuration = "OFF"
  account_recovery_setting {
    recovery_mechanism {
      name = "verified_email"
      priority = 1
    }
  }
  auto_verified_attributes = ["email"]
}

### Cognito user pool client
### some values listed below are optional, but I thought I call them out for clarity

resource "aws_cognito_user_pool_client" "example_ucl_user_pool_client" {
  name = "example_ucl_user_pool_client"
  user_pool_id = aws_cognito_user_pool.example_ucl_user_pool.id
  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  enable_token_revocation = true
  prevent_user_existence_errors = "ENABLED"
  refresh_token_validity = 30
  access_token_validity = 3600
  id_token_validity = 3600

  token_validity_units {
    access_token = "seconds"
    refresh_token = "days"
    id_token = "seconds"
  }
}


### SECTION TO DECLARE API GATEWAY INTEGRATION WITH LAMBDA
### We use a custom authorizer to authenticate all API calls with the user credential tokens
### We then define 2 integration points, one for the authentication lambda and one for the user api lambda
### It all comes together in the API GATEWAY route
### Note how the 2 different lambdas and the authorizer are being referenced

### DEFINE THE API GATEWAY (version2)
resource "aws_apigatewayv2_api" "serverless_gateway" {
  name          = "example_serverless_lambda_gateway"
  description   = "An example API Gateway for serverless backend"
  protocol_type = "HTTP"
}

### USING COGNITO AS AN API GATEWAY AUTHORISER
resource "aws_apigatewayv2_authorizer" "example_jwt_authorizer" {
  api_id                            = aws_apigatewayv2_api.serverless_gateway.id
  authorizer_type                   = "JWT"
  identity_sources                  = ["$request.header.Authorization"]
  name                              = "cognito_authorizer"
  jwt_configuration {
    audience = [aws_cognito_user_pool.example_ucl_user_pool.id]
    issuer = "https://${aws_cognito_user_pool.example_ucl_user_pool.endpoint}"
  }
}

### PERMITTING API GATEWAY TO USE EACH OF OUR LAMBDA FUNCTIONS
### WE NEED TO DO THIS FOR EACH DEFINED LAMBDA FUNCTION 

# CreateMedia
resource "aws_lambda_permission" "api_gateway_createmedia_permission" {
  statement_id  = "AllowAPIGatewayCreateMediaAPI"
  function_name = aws_lambda_function.createMediaItem_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}

# DeleteMedia
resource "aws_lambda_permission" "api_gateway_deletemedia_permission" {
  statement_id  = "AllowAPIGatewayDeleteMediaAPI"
  function_name = aws_lambda_function.deleteMediaItemById_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}

# GetMediaForUser
resource "aws_lambda_permission" "api_gateway_getmediaforuser_permission" {
  statement_id  = "AllowAPIGatewayGetMediaForUserAPI"
  function_name = aws_lambda_function.getAllMediaItemsByUserId_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}

# GetMediaByID
resource "aws_lambda_permission" "api_gateway_getmediabyid_permission" {
  statement_id  = "AllowAPIGatewayGetMediaByIDAPI"
  function_name = aws_lambda_function.getMediaItemById_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}

# UpdateMedia
resource "aws_lambda_permission" "api_gateway_updatemedia_permission" {
  statement_id  = "AllowAPIGatewayUpdateMediaAPI"
  function_name = aws_lambda_function.updateMediaItem_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}

# PresignedUrl
resource "aws_lambda_permission" "api_gateway_presignedurl_permission" {
  statement_id  = "AllowGetPresignedURL"
  function_name = aws_lambda_function.getPresignedUrl_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}



### integration of lambda functions with API gateway
### NOTE: WHEN USING 'integration_type = "AWS_PROXY" the following must be set 
### 'integration_method = "POST" ' 
# Create Media
resource "aws_apigatewayv2_integration" "int_createmedialambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.createMediaItem_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "createmedia_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "POST /media"
  target             = "integrations/${aws_apigatewayv2_integration.int_createmedialambdas.id}"
}

# Delete Media
resource "aws_apigatewayv2_integration" "int_deletemedialambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.deleteMediaItemById_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "deletemedia_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "DELETE /media/{username}/{mediaItemId}"
  target             = "integrations/${aws_apigatewayv2_integration.int_deletemedialambdas.id}"
}

# Get Media for User
resource "aws_apigatewayv2_integration" "int_getmediabyuserlambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.getAllMediaItemsByUserId_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "getmediabyuser_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "GET /media/{username}"
  target             = "integrations/${aws_apigatewayv2_integration.int_getmediabyuserlambdas.id}"
}

# Get Media by ID
resource "aws_apigatewayv2_integration" "int_getmediabyidlambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.getMediaItemById_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "getmediabyid_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "GET /media/{username}/{mediaItemId}"
  target             = "integrations/${aws_apigatewayv2_integration.int_getmediabyidlambdas.id}"
}

# Update Media
resource "aws_apigatewayv2_integration" "int_updatemedialambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.updateMediaItem_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "updatemedia_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "PATCH /media/{username}/{mediaItemId}"
  target             = "integrations/${aws_apigatewayv2_integration.int_updatemedialambdas.id}"
}

# Presigned URL
resource "aws_apigatewayv2_integration" "int_getpresignedurllambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.getPresignedUrl_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "getpresignedurl_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "POST /getPresignedUrl"
  target             = "integrations/${aws_apigatewayv2_integration.int_getpresignedurllambdas.id}"
}


