
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

# define the delete media lambda function
resource "aws_lambda_function" "deleteMediaItemById_lambda" {
  function_name    = "DeleteMediaItem"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_delete_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.deleteMediaItemById_data.output_base64sha256
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

# define the get media by id lambda function
resource "aws_lambda_function" "getMediaItemById_lambda" {
  function_name    = "GetMediaItemById"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_getbyid_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.getMediaItemById_data.output_base64sha256
  role             = aws_iam_role.lambda_exec_role.arn
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
  source_code_hash = data.archive_file.updateMediaItem_data.output_base64sha256
  role             = aws_iam_role.lambda_exec_role.arn
  environment {
    variables = {
      TF_VAR_dynamodb_name = var.dynamodb_name
      TF_VAR_s3_media_bucket_name = var.s3_media_bucket_name
    }
  }
}



