## Instance Bucket


## Resource: S3 Bucket
resource "aws_s3_bucket" "this" {
  bucket = "${var.project}-${var.environment}-bucket"
  ## Beware: This allows TF to destroy the resource even if the bucket is not empty
  force_destroy = true

  tags = merge({
    Name = "${var.project}-${var.environment}-bucket"
  })
}

## Public Access Block

resource "aws_s3_bucket_public_access_block" "app_bucket_block" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
