
### DEFINE THE ROLE AND ROLE POLICIES FOR LAMBDA FUNCTIONS
### lambda functions need to be executed with a defined role 



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
  role             = aws_iam_role.lambda_exec_role.arn
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
  role             = aws_iam_role.lambda_exec_role.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}

# define the lambda function to handle pre-signed URLs - needed to access the media in the separate S3 bucket

resource "aws_lambda_function" "preSignedUrl_lambda" {
  function_name    = "preSignedUrl"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_presigned_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.preSignedUrl_data.output_base64sha256
  role             = aws_iam_role.lambda_exec_role.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}

##### <ADD A NEW LAMBDA FUNCTION>
## THE VALUES FOR s3_key AND source_code_hash ARE DEFINED IN s3_lambdabucket.tf

#resource "aws_lambda_function" "<TERRAFORM_NAME_OF_LAMBDA>" {
#  function_name    = "<YOURNAME>"
#  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
#  s3_key           = aws_s3_object.<S3_OBJECT_NAME>.key
#  runtime          = "nodejs12.x"
#  handler          = "index.handler"
#  source_code_hash = data.archive_file.<YOUR_NEW_LAMBDA_ARCHIVE_NAME>.output_base64sha256
#  role             = aws_iam_role.lambda_exec_role.arn
#  environment {
#    variables = {
#      TF_VAR_dynamodb_name = var.dynamodb_name
#      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
#    }
#  }
#}

