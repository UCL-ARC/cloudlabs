### THE WEB-SITE BUCKET
resource "aws_s3_bucket" "serverless_app_website" {
  bucket = var.s3_web_bucket_name
  force_destroy = true
  tags = {
    Name = var.s3_web_bucket_name
  }
}

resource "aws_s3_bucket_acl" "web_bucket_acl" {
  bucket = aws_s3_bucket.serverless_app_website.id
  acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "serverless_app_web_config" {
  bucket = aws_s3_bucket.serverless_app_website.id
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "serverless_app_web_policy" {
  bucket = aws_s3_bucket.serverless_app_website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource = [
          aws_s3_bucket.serverless_app_website.arn,
          "${aws_s3_bucket.serverless_app_website.arn}/*",
        ]
      },
    ]
  })
}

### BUCKET FOR THE MEDIA STORAGE
resource "aws_s3_bucket" "media_for_serverless_app" {
  bucket = var.s3_media_bucket_name
  force_destroy = true
  tags = {
    Name = var.s3_media_bucket_name
  }
}



resource "aws_s3_bucket_acl" "webapp_media_bucket" {
  bucket = aws_s3_bucket.media_for_serverless_app.id
  acl = "private"
}

resource "aws_s3_bucket_policy" "serverless_app_media_policy" {
  bucket = aws_s3_bucket.media_for_serverless_app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "ReadGetDeleteObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"]
        Resource = [
          aws_s3_bucket.media_for_serverless_app.arn,
          "${aws_s3_bucket.media_for_serverless_app.arn}/*",
        ]
      },
    ]
  })

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