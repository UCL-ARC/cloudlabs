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
  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["Content-Type","Authorization", "Origin", "Accept", "X-Requested-With"]
    allow_methods = ["GET","POST","OPTIONS","PATCH","PUT","DELETE"]
  }
}


resource "aws_apigatewayv2_stage" "dev"{
  api_id = aws_apigatewayv2_api.serverless_gateway.id
  name = var.environments
}

resource "aws_apigatewayv2_deployment" "dev_deployment"{
  api_id = aws_apigatewayv2_api.serverless_gateway.id
  description = "Test Dev deployment"
  triggers = {
    redeployment = sha1(join(",", tolist([
      jsonencode(aws_apigatewayv2_integration.int_createmedialambdas),
      jsonencode(aws_apigatewayv2_route.createmedia_authorization),
      jsonencode(aws_apigatewayv2_integration.int_deletemedialambdas),
      jsonencode(aws_apigatewayv2_route.deletemedia_authorization),
      jsonencode(aws_apigatewayv2_integration.int_getmediabyuserlambdas),
      jsonencode(aws_apigatewayv2_route.getmediabyuser_authorization),
      jsonencode(aws_apigatewayv2_integration.int_getmediabyidlambdas),
      jsonencode(aws_apigatewayv2_route.getmediabyid_authorization),
      jsonencode(aws_apigatewayv2_integration.int_updatemedialambdas),
      jsonencode(aws_apigatewayv2_route.updatemedia_authorization),
      jsonencode(aws_apigatewayv2_integration.int_getpresignedurllambdas),
      jsonencode(aws_apigatewayv2_route.getpresignedurl_authorization)
    ])))
  }

  lifecycle {
    create_before_destroy = true
  }
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



