terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
  
  # bootstrap 실행 후 주석 해제
  # backend "s3" {
  #   bucket         = "clouddoctor-terraform-state-xxxxxxxx"
  #   key            = "prod/terraform.tfstate"
  #   region         = "ap-northeast-2"
  #   dynamodb_table = "clouddoctor-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}

# 키 페어 모듈 (자동 생성)
module "keypair" {
  source = "./modules/keypair"
  
  project_name = var.project_name
  environment  = var.environment
}

# VPC 모듈
module "vpc" {
  source = "./modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  
  availability_zones = var.availability_zones
}

# Security Groups 모듈
module "security_groups" {
  source = "./modules/security_groups"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
}

# RDS 모듈
module "rds" {
  source = "./modules/rds"
  
  project_name = var.project_name
  environment  = var.environment
  
  vpc_id               = module.vpc.vpc_id
  private_subnet_ids   = module.vpc.private_subnet_ids
  db_security_group_id = module.security_groups.rds_security_group_id
  
  db_name           = var.db_name
  db_username       = var.db_username
  db_password       = var.db_password
  db_instance_class = var.db_instance_class
}

# ElastiCache 모듈
module "elasticache" {
  source = "./modules/elasticache"
  
  project_name = var.project_name
  environment  = var.environment
  
  vpc_id                  = module.vpc.vpc_id
  private_subnet_ids      = module.vpc.private_subnet_ids
  redis_security_group_id = module.security_groups.redis_security_group_id
  redis_node_type         = var.redis_node_type
}

# ALB 모듈
module "alb" {
  source = "./modules/alb"
  
  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name
  
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  alb_security_group_id = module.security_groups.alb_security_group_id
}

# S3 모듈 (이미지 저장용)
module "s3" {
  source = "./modules/s3"
  
  project_name = var.project_name
  environment  = var.environment
}

# EC2 모듈
module "ec2" {
  source = "./modules/ec2"
  
  project_name = var.project_name
  environment  = var.environment
  
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  
  bastion_security_group_id = module.security_groups.bastion_security_group_id
  app_security_group_id     = module.security_groups.app_security_group_id
  
  key_pair_name         = module.keypair.key_name
  bastion_instance_type = var.bastion_instance_type
  app_instance_type     = var.app_instance_type
  
  target_group_arn = module.alb.target_group_arn
  s3_bucket_name   = module.s3.bucket_name
}