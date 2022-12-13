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
