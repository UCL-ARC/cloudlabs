output "user_pool_id" {
    description = "Cognito User Pool ID"
    value = aws_cognito_user_pool.example_ucl_user_pool.id
}

output "user_pool_client_id" {
    description = "Cognito User Pool Client ID"
    value = aws_cognito_user_pool_client.example_ucl_user_pool_client.id
}