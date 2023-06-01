### This defines the sources of the lambda functions we want to upload to the S3 lambda bucket

data "archive_file" "createMediaItem_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/createMediaItem"
  output_path = "${path.module}/createMediaItem.zip"
}

data "archive_file" "getAllMediaItemsByUserId_data" {
  type        = "zip"
  source_dir  = "${var.local_lambda_source}/getAllMediaItemsByUserId"
  output_path = "${path.module}/getAllMediaItemsByUserId.zip"
}

data "archive_file" "preSignedUrl_data" {
  type = "zip"
  source_dir  = "${var.local_lambda_source}/preSignedUrl"
  output_path = "${path.module}/preSignedUrl.zip"  
}


### BUCKET FOR THE LAMBDA FUNCTIONS
#S3 Bucket to store the lambda functions and web app in
resource "aws_s3_bucket" "lambda_bucket_for_serverless_app" {
  bucket = var.s3_lambda_bucket_name
  force_destroy = true
  tags = {
    Name = "bucketforlambdafunctions"
  }
}

resource "aws_s3_bucket_ownership_controls" "lambda_ownership_controls" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}


resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  depends_on = [ aws_s3_bucket_ownership_controls.lambda_ownership_controls ]
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

  acl = "bucket-owner-full-control"
}

#get all media items
resource "aws_s3_object" "serverless_getall_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "getAllMediaItemsByUserId.zip"
  source = data.archive_file.getAllMediaItemsByUserId_data.output_path
  etag   = filemd5(data.archive_file.getAllMediaItemsByUserId_data.output_path)

  acl = "bucket-owner-full-control"
}

resource "aws_s3_object" "serverless_presigned_object" {
  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
  key    = "preSignedUrl.zip"
  source = data.archive_file.preSignedUrl_data.output_path
  etag   = filemd5(data.archive_file.preSignedUrl_data.output_path)

  acl = "bucket-owner-full-control"
}

######## ADD MORE LAMBDA FUNCTIONS

## NEW DATA SOURCE
#data "archive_file" "<YOUR_NEW_LAMBDA_ARCHIVE_NAME>" {
#  type        = "zip"
#  source_dir  = "${var.local_lambda_source}/<LAMBDA_ARCHIVE_SOURCE_FOLDER_NAME>"
#  output_path = "${path.module}/<LAMBDA_ARCHIVE_NAME>.zip"
#}

## NEW S3 OBJECT
#delete media item
#resource "aws_s3_object" "<S3_OBJECT_NAME>" {
#  bucket = aws_s3_bucket.lambda_bucket_for_serverless_app.id
#  key    = "<LAMBDA_ARCHIVE_NAME>.zip"
#  source = data.archive_file.<YOUR_NEW_LAMBDA_ARCHIVE_NAME_FROM_ABOVE>.output_path
#  etag   = filemd5(data.archive_file.<YOUR_NEW_LAMBDA_ARCHIVE_NAME_FROM_ABOVE>.output_path)
#}

