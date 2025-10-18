output "bucket_name" {
  description = "S3 버킷 이름"
  value       = aws_s3_bucket.images.bucket
}

output "bucket_arn" {
  description = "S3 버킷 ARN"
  value       = aws_s3_bucket.images.arn
}

output "bucket_domain_name" {
  description = "S3 버킷 도메인 이름"
  value       = aws_s3_bucket.images.bucket_domain_name
}