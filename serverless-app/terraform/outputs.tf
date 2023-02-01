output "REACT_APP_COGNITO_USERPOOL_ID" {
    description = "Cognito User Pool ID"
    value = aws_cognito_user_pool.example_ucl_user_pool.id
}

output "REACT_APP_COGNITO_CLIENT_ID" {
    description = "Cognito User Pool Client ID"
    value = aws_cognito_user_pool_client.example_ucl_user_pool_client.id
}

output "REACT_APP_API_ENDPOINT" {
    description = "AWS API Endpoint"
    value = aws_apigatewayv2_api.serverless_gateway.api_endpoint
}

output "REACT_APP_S3_BUCKET" {
    description = "S3 Static Web App Bucket"
    value = aws_s3_bucket.serverless_app_website.bucket
}

output "API_RESOURCE_ARN" {
    description = "API Gateway Resource ARN"
    value = aws_apigatewayv2_api.serverless_gateway.execution_arn
}
