variable "aws_region" {
  description = "AWS 리전"
  type        = string
  default     = "ap-northeast-2"
}

variable "project_name" {
  description = "프로젝트 이름"
  type        = string
  default     = "clouddoctor"
}

variable "environment" {
  description = "환경 (prod, dev, staging)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "도메인 이름"
  type        = string
  default     = "cloud-doctor.site"
}

# VPC 설정
variable "vpc_cidr" {
  description = "VPC CIDR 블록"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "가용 영역"
  type        = list(string)
  default     = ["ap-northeast-2a", "ap-northeast-2c"]
}

variable "public_subnet_cidrs" {
  description = "퍼블릭 서브넷 CIDR"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "프라이빗 서브넷 CIDR"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

# 데이터베이스 설정
variable "db_name" {
  description = "데이터베이스 이름"
  type        = string
  default     = "clouddoctor"
}

variable "db_username" {
  description = "데이터베이스 사용자명"
  type        = string
  default     = "clouddoctor"
}

variable "db_password" {
  description = "데이터베이스 비밀번호"
  type        = string
  sensitive   = true
}

# EC2 설정
variable "bastion_instance_type" {
  description = "Bastion 호스트 인스턴스 타입"
  type        = string
  default     = "t2.micro"
}

variable "app_instance_type" {
  description = "애플리케이션 서버 인스턴스 타입 (프론트엔드, 백엔드, Jenkins)"
  type        = string
  default     = "t3.medium"
}

# RDS 설정
variable "db_instance_class" {
  description = "RDS 인스턴스 클래스"
  type        = string
  default     = "db.t3.micro"
}

# ElastiCache 설정
variable "redis_node_type" {
  description = "ElastiCache Redis 노드 타입"
  type        = string
  default     = "cache.t3.micro"
}