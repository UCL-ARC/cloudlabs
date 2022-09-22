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

/* DYNAMODB 
This defines the single table in DynamoDB. Note: only the hash_key and the range_key (if used)
must be declared in this resource. All additional attributes will be automatically declared when
writing to/reading from the table. 
If a global/local index is used, this must be declared as well (and the associated attributes with it)
*/

resource "aws_dynamodb_table" "user-places-table" {
  name           = "users_and_places"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "UserName"
  range_key      = "MediaItem"

  attribute {
    name = "UserName"
    type = "S"
  }
  attribute {
    name = "MediaItem"
    type = "S"
  }
}

### THE WEB-SITE BUCKET
resource "aws_s3_bucket" "serverless_app_website" {
  tags = {
    Name = "S3BucketForServerlessAppWebsite"
  }
}

resource "aws_s3_bucket_acl" "web_bucket_acl" {
  bucket = aws_s3_bucket.serverless_app_website.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "serverless_app_web_config" {
  bucket = aws_s3_bucket.serverless_app_website.id
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "serverless_app_web_policy" {
  bucket = aws_s3_bucket.serverless_app_website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource = [
          aws_s3_bucket.serverless_app_website.arn,
          "${aws_s3_bucket.serverless_app_website.arn}/*",
        ]
      },
    ]
  })
}

### SECTION FOR DECLARING S3 Buckets  
### S3 is used to store and run the lambda functions
###
#S3 Bucket to store the lambda functions and web app in


resource "aws_s3_bucket" "lambda_bucket_for_serverless_app" {
  tags = {
    Name = "TestBucketForServerlessApp"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  acl    = "private"
}

### SECTION FOR DECLARING LAMBDA FUNCTIONS
### there are 2 lambda functions
### a.) the first to handle user authentication
### b.) the second to handle API request
### ALL API calls and methods (GET,POST, DELETE, PATCH) require authentication 

# Local Lambda Functions to be zipped up and uploaded to the S3 bucket
# the first is the lambda function authenticating users
data "archive_file" "auth_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/lambda-functions/auth"
  output_path = "${path.module}/auth-serverless.zip"
}

# this lambda function are the user-api lambdas
data "archive_file" "apis_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/lambda-functions/apis"
  output_path = "${path.module}/apis.zip"
}

#the S3 object for the authenticating lambda function
resource "aws_s3_object" "serverless_auth_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "auth-serverless.zip"
  source = data.archive_file.auth_lambda.output_path
  etag   = filemd5(data.archive_file.auth_lambda.output_path)
}

#the S3 object for the user api lambda functions
resource "aws_s3_object" "serverless_apis_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "apis.zip"
  source = data.archive_file.apis_lambda.output_path
  etag   = filemd5(data.archive_file.apis_lambda.output_path)
}

# define the authorisation lambda functions
resource "aws_lambda_function" "authorisation_lambda" {
  function_name    = "AuthoriseUser"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_auth_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.auth_lambda.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
}

# define the user api lambda function
resource "aws_lambda_function" "user_apis_lambda" {
  function_name    = "UserAPIs"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_apis_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.apis_lambda.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
}


# This gives the API Gateway permission to use the authorization and user APIs lambdas
resource "aws_lambda_permission" "api_gateway_authorization_permission" {
  statement_id  = "AllowAPIGatewayAuthorization"
  function_name = aws_lambda_function.authorisation_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
}

resource "aws_lambda_permission" "api_gateway_userapis_permission" {
  statement_id  = "AllowAPIGatewayUserAPIS"
  function_name = aws_lambda_function.user_apis_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
}


# The documentation isn't clear on this. But the IAM role needs 2 policy attachment, one for being able to
# interact with DynamoDB and another more generic one to do lambda executions
#define an IAM role for all lambda functions
# --- as a separate terraform ----

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaDynamoDBExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_basic_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

### SECTION TO DECLARE API GATEWAY INTEGRATION WITH LAMBDA
### We use a custom authorizer to authenticate all API calls with the user credential tokens
### We then define 2 integration points, one for the authentication lambda and one for the user api lambda
### It all comes together in the API GATEWAY route
### Note how the 2 different lambdas and the authorizer are being referenced

# API Gateway
# Section for the API gateway
# --- as a separate terraform ----
resource "aws_apigatewayv2_api" "serverless_gateway" {
  name          = "example_serverless_lambda_gateway"
  description   = "An example API Gateway for serverless backend"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_authorizer" "example_jwt_authorizer" {
  api_id                            = aws_apigatewayv2_api.serverless_gateway.id
  identity_sources                  = ["$request.header.Authorization"]
  authorizer_type                   = "REQUEST"
  name                              = "lambda_jwt_authorizer"
  authorizer_payload_format_version = "2.0"
  authorizer_uri                    = aws_lambda_function.authorisation_lambda.invoke_arn
  enable_simple_responses           = true
}

resource "aws_apigatewayv2_integration" "example_serverless_app_lambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.user_apis_lambda.invoke_arn
}


resource "aws_apigatewayv2_route" "example_route_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "ANY /{proxy+}"
  target             = "integrations/${aws_apigatewayv2_integration.example_serverless_app_lambdas.id}"
}



