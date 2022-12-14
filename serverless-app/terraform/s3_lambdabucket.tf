### This defines the sources of the lambda functions we want to upload to the S3 lambda bucket

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

data "archive_file" "getPresignedUrl_data" {
  type = "zip"
  source_dir  = "${var.local_lambda_source}/getPresignedUrl"
  output_path = "${path.module}/getPresignedUrl.zip"  
}


### BUCKET FOR THE LAMBDA FUNCTIONS
#S3 Bucket to store the lambda functions and web app in
resource "aws_s3_bucket" "lambda_bucket_for_serverless_app" {
  bucket = "terraform-bucketforlambdafunctions"
  force_destroy = true
  tags = {
    Name = "bucketforlambdafunctions"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  acl    = "private"
}

#S3 Objects - these are the Zip'd lambda functions
#create media item
resource "aws_s3_object" "serverless_create_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "createMediaItem.zip"
  source = data.archive_file.createMediaItem_data.output_path
  etag   = filemd5(data.archive_file.createMediaItem_data.output_path)
}

#delete media item
resource "aws_s3_object" "serverless_delete_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "deleteMediaItemById.zip"
  source = data.archive_file.deleteMediaItemById_data.output_path
  etag   = filemd5(data.archive_file.deleteMediaItemById_data.output_path)
}

#get all media items
resource "aws_s3_object" "serverless_getall_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "getAllMediaItemsByUserId.zip"
  source = data.archive_file.getAllMediaItemsByUserId_data.output_path
  etag   = filemd5(data.archive_file.getAllMediaItemsByUserId_data.output_path)
}

#get media by id
resource "aws_s3_object" "serverless_getbyid_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "getMediaItemById.zip"
  source = data.archive_file.getMediaItemById_data.output_path
  etag   = filemd5(data.archive_file.getMediaItemById_data.output_path)
}

#update media item
resource "aws_s3_object" "serverless_update_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "updateMediaItem.zip"
  source = data.archive_file.updateMediaItem_data.output_path
  etag   = filemd5(data.archive_file.updateMediaItem_data.output_path)
}

resource "aws_s3_object" "serverless_presigned_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "getPresignedUrl.zip"
  source = data.archive_file.getPresignedUrl_data.output_path
  etag   = filemd5(data.archive_file.getPresignedUrl_data.output_path)
}