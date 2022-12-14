
### DEFINE THE ROLE AND ROLE POLICIES FOR LAMBDA FUNCTIONS
### lambda functions need to be executed with a defined role 

/**
IAM:= Identity and Access Management

aws_iam_role, aws_iam_role_policy, aws_iam_role_policy_attachment, aws_iam_policy, aws_iam_policy_attachment
the terminology of that can be quite confusing. 
also, AWS creates some of this per default when creating resources in the management console. 
But in terraform this needs to be specific. 

IAM roles need to be created for an account and associated with AWS components. AWS follows a
strict Nothing-Is-Allowed-Unless-You-Say-So. 
In terraform we need to be explicit about each component/resource, what permissions it needs, 
which are the users that can access this resource

Chances are you definitely need a aws_iam_role resource, e.g. for CloudWatch logging or Lambda functions
Each role has a policy associated with it, that specifies what this role can (or cannot) do

But there are 2 different routes to accomplish that
Route 1: 
aws_iam_role and aws_iam_role_policy
This ties the policy to the role directly. And only to that role. You cannot assign a policy to several roles that way

Route 2:
aws_iam_role, aws_iam_policy and aws_iam_role_policy_attachment
a more indirect way. First define your policy in aws_iam_policy. 
The next step is to attach this policy to a role using aws_iam_role_policy_attachment
That way the same policy can be attached to different roles with
aws_iam_role_policy_attachment providing the link between role and policy. 

Talking of policies:
there is the assume_role_policy and then the actual policy. So what's the difference?
assume_role_policy -> this is like defining permissions for a user or group of users. It's a required field in a aws_iam_role resource
E.g. for lambda functions roles are defined to specify what a lambda function can do (recalling that by default no permissions are given)

The policy document 

*/

# Define the general policy/permissions for lambda functions
# This is restricted to DynamoDB only for now

resource "aws_iam_policy" "lambda_policy" {
  name = "lambda_policy_for_cloudwatch_dynamodb"
  policy = file("dynamodb_watch_policy.json")
}

# Define the role lambda functions will assume when executing
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"
  assume_role_policy = file("assume_role_policy.json")
}

# Tie role and policy together
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "${aws_iam_policy.lambda_policy.arn}"
}



### DEFINE THE LAMBDA FUNCTIONS
# define the create media item lambda functions
# each function assumes the same role as defined above allowing them to access DynamoDB

resource "aws_lambda_function" "createMediaItem_lambda" {
  function_name    = "CreateMediaItem"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_create_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.createMediaItem_data.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}

# define the delete media lambda function
resource "aws_lambda_function" "deleteMediaItemById_lambda" {
  function_name    = "DeleteMediaItem"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_delete_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.deleteMediaItemById_data.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}

# define the get all media lambda function
resource "aws_lambda_function" "getAllMediaItemsByUserId_lambda" {
  function_name    = "GetAllMediaItemsByUserId"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_getall_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.getAllMediaItemsByUserId_data.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}

# define the get media by id lambda function
resource "aws_lambda_function" "getMediaItemById_lambda" {
  function_name    = "GetMediaItemById"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_getbyid_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.getMediaItemById_data.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}

# define the delete media lambda function
resource "aws_lambda_function" "updateMediaItem_lambda" {
  function_name    = "UpdateMediaItem"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_update_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.updateMediaItem_data.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}

# define the lambda function to handle pre-signed URLs - needed to access the media in the separate S3 bucket

resource "aws_lambda_function" "getPresignedUrl_lambda" {
  function_name    = "preSignedUrl"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_presigned_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.updateMediaItem_data.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}



