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

### Turns out that setting acl = "private" in aws_s3_bucket_acl is not enough. 
### Need to add this otherwise the bucket has public acccess
resource "aws_s3_bucket_public_access_block" "s3_public_access_media" {
  bucket = aws_s3_bucket.media_for_serverless_app.id
  block_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "s3_cors" {
  bucket = aws_s3_bucket.media_for_serverless_app.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "DELETE", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
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
