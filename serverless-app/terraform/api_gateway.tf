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
    allow_credentials = false
    allow_origins = ["*"]
    allow_headers = ["Content-Type","Authorization", "Origin", "Accept", "X-Requested-With"]
    allow_methods = ["GET","POST","OPTIONS","PATCH","PUT","DELETE"]
    expose_headers = []
    max_age = 300
  }
}

###
resource "aws_apigatewayv2_stage" "default"{
  api_id = aws_apigatewayv2_api.serverless_gateway.id
  name = "$default"
  auto_deploy = true
}

### USING COGNITO AS AN API GATEWAY AUTHORISER
resource "aws_apigatewayv2_authorizer" "example_jwt_authorizer" {
  api_id                            = aws_apigatewayv2_api.serverless_gateway.id
  authorizer_type                   = "JWT"
  identity_sources                  = ["$request.header.Authorization"]
  name                              = "Cognito"
  jwt_configuration {
    audience = [aws_cognito_user_pool_client.example_ucl_user_pool_client.id]
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

# GetMediaForUser
resource "aws_lambda_permission" "api_gateway_getmediaforuser_permission" {
  statement_id  = "AllowAPIGatewayGetMediaForUserAPI"
  function_name = aws_lambda_function.getAllMediaItemsByUserId_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}

# PresignedUrl
resource "aws_lambda_permission" "api_gateway_presignedurl_permission" {
  statement_id  = "AllowPresignedURL"
  function_name = aws_lambda_function.preSignedUrl_lambda.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
}



### integration of lambda functions with API gateway
### NOTE: WHEN USING 'integration_type = "AWS_PROXY" the following must be set 
### 'integration_method = "POST" ' 
# Create Media ########
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
  route_key          = "POST /media/{username}/new"
  target             = "integrations/${aws_apigatewayv2_integration.int_createmedialambdas.id}"
}
###########

# Get Media for User ########
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

###########

# Presigned URL ########
resource "aws_apigatewayv2_integration" "int_presignedurllambdas" {
  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = aws_lambda_function.preSignedUrl_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "presignedurl_authorization" {
  api_id             = aws_apigatewayv2_api.serverless_gateway.id
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
  route_key          = "POST /preSignedUrl"
  target             = "integrations/${aws_apigatewayv2_integration.int_presignedurllambdas.id}"
}

############

### <ADD MORE LAMBDA INTEGRATIONS/FUNCTIONS>
## lambda functions are defined in lambdas.tf 

#resource "aws_lambda_permission" "<PERMISSION_TO_USE_YOUR_NEW_LAMBDA_FUNCTION>" {
#  function_name = aws_lambda_function.<YOUR_LAMBDA_FUNCTION_NAME>.function_name
#  statement_id  = "<YOUR_STATEMENT_ID>"
#  action        = "lambda:InvokeFunction"
#  principal     = "apigateway.amazonaws.com"
#  source_arn = "${aws_apigatewayv2_api.serverless_gateway.execution_arn}/*/*/*"
#}


#resource "aws_apigatewayv2_integration" "<YOUR_LAMBDA_INTEGRATION>" {
#  api_id                 = aws_apigatewayv2_api.serverless_gateway.id
#  integration_type       = "AWS_PROXY"
#  connection_type        = "INTERNET"
#  integration_method     = "POST"
#  payload_format_version = "2.0"
#  integration_uri        = aws_lambda_function.<SEE_NAME_OF_aws_lambda_permission_ABOVE>.invoke_arn
#}

#resource "aws_apigatewayv2_route" "<LAMBDA_ROUTE_AUTHORISATION" {
#  api_id             = aws_apigatewayv2_api.serverless_gateway.id
#  authorization_type = "JWT"
#  authorizer_id      = aws_apigatewayv2_authorizer.example_jwt_authorizer.id
#  route_key          = "<GET | POST | PUT | DELETE | PATCH | ANY> /<YOUR_END_POINT>"
#  target             = "integrations/${aws_apigatewayv2_integration.<YOUR_LAMBDA_INTEGRAITON_FROM_ABOVE>.id}"
#}

