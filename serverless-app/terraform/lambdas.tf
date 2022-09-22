data "archive_file" "createMediaItem_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/media/createMediaItem"
  output_path = "${path.module}/zip/createMediaItem.zip"
}

data "archive_file" "deleteMediaItemById_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/media/deleteMediaItemById"
  output_path = "${path.module}/deleteMediaItemById.zip"
}

data "archive_file" "getAllMediaItemsByUserId_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/media/getAllMediaItemsByUserId"
  output_path = "${path.module}/getAllMediaItemsByUserId.zip"
}

data "archive_file" "getMediaItemById_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/media/getMediaItemById"
  output_path = "${path.module}/getMediaItemById.zip"
}

data "archive_file" "updateMediaItem_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/media/updateMediaItem"
  output_path = "${path.module}/updateMediaItem.zip"
}

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
