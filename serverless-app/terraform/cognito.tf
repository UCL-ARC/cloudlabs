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
