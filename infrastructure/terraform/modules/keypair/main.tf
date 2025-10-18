# TLS 프라이빗 키 생성
resource "tls_private_key" "main" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# AWS 키 페어 생성
resource "aws_key_pair" "main" {
  key_name   = "${var.project_name}-${var.environment}-key"
  public_key = tls_private_key.main.public_key_openssh

  tags = {
    Name = "${var.project_name}-${var.environment}-key"
  }
}

# 로컬에 프라이빗 키 저장
resource "local_file" "private_key" {
  content  = tls_private_key.main.private_key_pem
  filename = "${path.root}/${var.project_name}-${var.environment}-key.pem"
  
  provisioner "local-exec" {
    command = "chmod 400 ${path.root}/${var.project_name}-${var.environment}-key.pem"
  }
}