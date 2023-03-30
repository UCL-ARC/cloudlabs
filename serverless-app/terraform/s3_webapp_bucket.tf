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
