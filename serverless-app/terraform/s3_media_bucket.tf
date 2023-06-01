### BUCKET FOR THE MEDIA STORAGE
resource "aws_s3_bucket" "media_for_serverless_app" {
  bucket = var.s3_media_bucket_name
  force_destroy = true
  tags = {
    Name = var.s3_media_bucket_name
  }
}

resource "aws_s3_bucket_public_access_block" "media_for_serverless_app" {
  bucket = aws_s3_bucket.media_for_serverless_app.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "media_ownership_controls" {
  bucket = aws_s3_bucket.media_for_serverless_app.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}


resource "aws_s3_bucket_acl" "webapp_media_bucket" {
  depends_on = [ aws_s3_bucket_ownership_controls.media_ownership_controls ]
  bucket = aws_s3_bucket.media_for_serverless_app.id
  acl = "private"
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
  depends_on = [ aws_s3_bucket_public_access_block.media_for_serverless_app ]
  bucket = aws_s3_bucket.media_for_serverless_app.id
  policy = data.aws_iam_policy_document.serverless_app_media_policy.json
}

data "aws_iam_policy_document" "serverless_app_media_policy" {
  statement {

    principals {
      type        = "*"
      identifiers = ["*"] 
    }

    effect = "Allow"
  
    actions = ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"]

    resources = [
           aws_s3_bucket.media_for_serverless_app.arn,
           "${aws_s3_bucket.media_for_serverless_app.arn}/*",
    ]
  }
}

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid       = "ReadGetDeleteObject"
#         Effect    = "Allow"
#         Principal = "*"
#         Action    = ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"]
#         Resource = [
#           aws_s3_bucket.media_for_serverless_app.arn,
#           "${aws_s3_bucket.media_for_serverless_app.arn}/*",
#         ]
#       },
#     ]
#   })
# }
