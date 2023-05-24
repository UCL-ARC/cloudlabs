### THE WEB-SITE BUCKET
resource "aws_s3_bucket" "serverless_app_website" {
  bucket = var.s3_web_bucket_name
  force_destroy = true
  tags = {
    Name = var.s3_web_bucket_name
  }
}

resource "aws_s3_bucket_public_access_block" "web_access_block" {
  bucket = aws_s3_bucket.serverless_app_website.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "web_ownership_controls"{
  bucket = aws_s3_bucket.serverless_app_website.id
  rule{
     object_ownership = "BucketOwnerPreferred"   
  }
}

resource "aws_s3_bucket_acl" "web_bucket_acl" {
  depends_on = [ 
    aws_s3_bucket_public_access_block.web_access_block,
    aws_s3_bucket_ownership_controls.web_ownership_controls
   ]
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
