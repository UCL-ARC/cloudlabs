data "archive_file" "createMediaItem_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/createMediaItem"
  output_path = "${path.module}/createMediaItem.zip"
}

data "archive_file" "deleteMediaItemById_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/deleteMediaItemById"
  output_path = "${path.module}/deleteMediaItemById.zip"
}

data "archive_file" "getAllMediaItemsByUserId_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/getAllMediaItemsByUserId"
  output_path = "${path.module}/getAllMediaItemsByUserId.zip"
}

data "archive_file" "getMediaItemById_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/getMediaItemById"
  output_path = "${path.module}/getMediaItemById.zip"
}

data "archive_file" "updateMediaItem_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/updateMediaItem"
  output_path = "${path.module}/updateMediaItem.zip"
}

### DEFINE THE ROLE AND ROLE POLICIES FOR LAMBDA FUNCTIONS
### lambda functions need to be executed with a defined role 
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
### Policies need to be attached to the role associated with Lambda functions
### these policies specify what AWS resources lambda functions can use
## policy attachments one for DynamoDB and one for using CloudWatch for logging
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaDynamoDBExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_basic_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


### DEFINE THE LAMBDA FUNCTIONS
# define the create media item lambda functions
resource "aws_lambda_function" "createMediaItem_lambda" {
  function_name    = "CreateMediaItem"
  s3_bucket        = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  s3_key           = aws_s3_object.serverless_create_object.key
  runtime          = "nodejs12.x"
  handler          = "index.handler"
  source_code_hash = data.archive_file.createMediaItem_data.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
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
}



