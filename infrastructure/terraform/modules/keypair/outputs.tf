output "key_name" {
  description = "키 페어 이름"
  value       = aws_key_pair.main.key_name
}

output "private_key_path" {
  description = "프라이빗 키 파일 경로"
  value       = local_file.private_key.filename
}