# CloudDoctor 인프라 구성

## 사전 준비

### 1. AWS CLI 설치

#### macOS
```bash
# Homebrew 사용 (권장)
brew install awscli

# 또는 직접 설치
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

#### Windows
```powershell
# Chocolatey 사용
choco install awscli

# 또는 MSI 설치 파일 다운로드
# https://awscli.amazonaws.com/AWSCLIV2.msi
```

#### Linux (Ubuntu/Debian)
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### 2. Terraform 설치

#### macOS
```bash
brew install terraform
```

#### Windows
```powershell
choco install terraform
```

#### Linux
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

### 3. AWS 자격증명 설정

#### AWS IAM 사용자 생성 (AWS 콘솔에서)
1. AWS 콘솔 → IAM → 사용자 → 사용자 추가
2. 프로그래밍 방식 액세스 선택
3. 기존 정책 직접 연결 → **AdministratorAccess** 선택 -- 개발용으로만 사용, 배포는 권한 축소 필수!
4. Access Key ID와 Secret Access Key 저장

#### AWS CLI 설정
```bash
aws configure
# AWS Access Key ID [None]: AKIA...
# AWS Secret Access Key [None]: wJalrXUt...
# Default region name [None]: ap-northeast-2
# Default output format [None]: json

# 설정 확인
aws sts get-caller-identity
```

### 4. SSH 키 페어 관리

#### 자동 생성 (권장)
- Terraform이 자동으로 키 페어 생성
- `clouddoctor-prod-key.pem` 파일이 로컬에 저장됨
- 권한 설정: `chmod 400 clouddoctor-prod-key.pem`

#### 기존 키 사용 (선택사항)
```bash
# 기존 AWS 키 페어가 있는 경우
terraform apply -var="key_pair_name=my-existing-key"
```

## 실행 순서

### 1. Bootstrap (S3 + DynamoDB) - 먼저 실행 필수
```bash
cd terraform/bootstrap
terraform init
terraform plan
terraform apply

# 출력된 S3 버킷명과 DynamoDB 테이블명을 기록
```

### 2. 메인 인프라 구성 (PEM 키 자동 생성)
```bash
cd ../
# main.tf에서 backend 설정 주석 해제 후 S3 버킷명 입력
terraform init
terraform plan -var="db_password=SecurePassword123!"
terraform apply -var="db_password=SecurePassword123!"

# PEM 키가 자동 생성됨: clouddoctor-prod-key.pem
```

### 3. 인스턴스 타입 커스터마이징 (선택사항)
```bash
terraform apply \
  -var="db_password=SecurePassword123!" \
  -var="bastion_instance_type=t2.micro" \
  -var="app_instance_type=t3.large" \
  -var="db_instance_class=db.t3.small" \
  -var="redis_node_type=cache.t3.small"
```

## 인프라 구성 요소

### 네트워크
- **VPC**: 10.0.0.0/16
- **퍼블릭 서브넷**: 10.0.1.0/24, 10.0.2.0/24 (ALB, Bastion)
- **프라이빗 서브넷**: 10.0.10.0/24, 10.0.20.0/24 (App, DB, Redis)
- **NAT Gateway**: 각 AZ별 1개씩 (선택사항)
- **Bastion NAT 프록시**: NAT Gateway 대신 사용 가능 (비용 절약)

### 컴퓨팅
- **Bastion Host**: 퍼블릭 서브넷 (SSH 접근용) - 기본: t2.micro
- **App Servers**: 프라이빗 서브넷 (Backend, Frontend, Jenkins) - 기본: t3.medium
- **ALB**: 퍼블릭 서브넷 (80/443 포트)

### 데이터베이스
- **RDS PostgreSQL**: 프라이빗 서브넷 (포트: 5432) - 기본: db.t3.micro
- **ElastiCache Redis**: 프라이빗 서브넷 (포트: 6379) - 기본: cache.t3.micro

### 스토리지
- **S3 버킷**: 이미지 저장용 (자동 생성, 암호화, CORS 설정)

### 보안
- **Security Groups**: 각 계층별 최소 권한
- **IAM Roles**: EC2, RDS, ElastiCache 접근 권한

### 도메인
- **Route53**: cloud-doctor.site
- **ACM**: SSL 인증서 (*.cloud-doctor.site)

## 포트 구성

### 외부 접근 (ALB)
- **HTTP**: 80 → Backend 9090
- **HTTPS**: 443 → Backend 9090
- **Frontend**: 3001 (개발용)

### 내부 서비스
- **Backend API**: 9090
- **PostgreSQL**: 5432
- **Redis**: 6379
- **SSH (Bastion)**: 22

### Security Groups
- **ALB**: 80, 443 (전체 허용)
- **Bastion**: 22 (관리자 IP만)
- **App**: 9090, 3001, 22 (VPC 내부만)
- **RDS**: 5432 (App SG에서만)
- **Redis**: 6379 (App SG에서만)

## 헬스체크 엔드포인트
- `GET /health` - ALB 헬스체크용 (포트 9090)
- `GET /` - 루트 상태 확인

## SSH 접속 및 NAT 프록시 설정

### 기본 SSH 접속
```bash
# Bastion 호스트 접속
ssh -i clouddoctor-prod-key.pem ec2-user@<bastion-public-ip>

# App 서버 접속 (Bastion 경유)
ssh -i clouddoctor-prod-key.pem -J ec2-user@<bastion-ip> ec2-user@<app-private-ip>
```

### Bastion NAT 프록시 설정 (NAT Gateway 대체)

#### Bastion 호스트에서 설정
```bash
# Bastion에 접속 후 NAT 프록시 활성화
ssh -i clouddoctor-prod-key.pem ec2-user@<bastion-public-ip>

# IP 포워딩 활성화
sudo sysctl -w net.ipv4.ip_forward=1
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf

# iptables NAT 규칙 추가
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
sudo iptables -A FORWARD -i eth0 -o eth1 -m state --state RELATED,ESTABLISHED -j ACCEPT

# iptables 규칙 영구 저장
sudo service iptables save
# 또는 Ubuntu/Debian의 경우
sudo apt-get install iptables-persistent
sudo netfilter-persistent save
```

#### 프라이빗 서버에서 라우팅 설정
```bash
# App 서버에 접속
ssh -i clouddoctor-prod-key.pem -J ec2-user@<bastion-ip> ec2-user@<app-private-ip>

# 기본 라우트를 Bastion으로 설정
sudo ip route add default via <bastion-private-ip>

# 또는 /etc/netplan/50-cloud-init.yaml 수정 (Ubuntu)
sudo nano /etc/netplan/50-cloud-init.yaml
# routes:
#   - to: 0.0.0.0/0
#     via: <bastion-private-ip>
sudo netplan apply
```

#### Terraform에서 자동 설정
```bash
# user_data 스크립트로 자동 설정
terraform apply -var="enable_nat_gateway=false" -var="use_bastion_as_nat=true"

# Bastion에 NAT 설정 자동 적용
# App 서버에 라우팅 자동 설정
```

## 환경 변수 설정
```bash
export TF_VAR_db_password="SecurePassword123!"
# 키 페어는 자동 생성되므로 불필요
```

## Jenkins 배포 설정

### Application.yml 환경별 설정
```yaml
# application-prod.yml (프로덕션)
spring:
  datasource:
    url: jdbc:postgresql://<rds-endpoint>:5432/clouddoctor
    username: clouddoctor
    password: ${DB_PASSWORD}
  
  data:
    redis:
      host: <elasticache-endpoint>
      port: 6379

aws:
  s3:
    bucket: <s3-bucket-name>
    region: ap-northeast-2
```

### Jenkins 파이프라인 예시
```groovy
pipeline {
    agent any
    
    environment {
        DB_PASSWORD = credentials('db-password')
        AWS_REGION = 'ap-northeast-2'
    }
    
    stages {
        stage('Build Backend') {
            steps {
                sh './gradlew build -Dspring.profiles.active=prod'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    # 백엔드 배포
                    java -jar -Dspring.profiles.active=prod \
                         -Dserver.port=9090 \
                         build/libs/clouddoctor.jar &
                    
                    # 프론트엔드 빌드 & 배포
                    cd frontend/cloud-doctor
                    npm run build
                    # Nginx 또는 정적 서빙
                '''
            }
        }
    }
}
```

### 내부 네트워크 접속 정보
- **RDS 엔드포인트**: Terraform output으로 확인
- **ElastiCache 엔드포인트**: Terraform output으로 확인  
- **S3 버킷명**: Terraform output으로 확인
- **모든 서비스**: VPC 내부 DNS로 통신

## 비용 정보

### 기본 인스턴스 타입 (프리티어)
- **Bastion**: t2.micro (프리티어) - 월 $0
- **App**: t3.medium (성능용) - 월 약 $30
- **RDS**: db.t3.micro (프리티어) - 월 $0
- **Redis**: cache.t3.micro (프리티어) - 월 $0
- **ALB**: 월 약 $20
- **NAT Gateway**: 월 약 $45 (2개 AZ)
- **총 예상 비용**: 월 약 $95

### 비용 절약 옵션

#### 1. NAT Gateway 제거 (월 $45 절약)
```bash
# Bastion을 NAT 프록시로 사용
terraform apply \
  -var="enable_nat_gateway=false" \
  -var="use_bastion_as_nat=true"

# 총 예상 비용: 월 약 $50 (NAT Gateway $45 절약)
```

#### 2. 개발용 소형 인스턴스
```bash
terraform apply \
  -var="app_instance_type=t2.micro" \
  -var="db_instance_class=db.t3.micro" \
  -var="redis_node_type=cache.t3.micro"
```

#### 3. 최대 절약 모드 (월 약 $20)
```bash
terraform apply \
  -var="enable_nat_gateway=false" \
  -var="use_bastion_as_nat=true" \
  -var="app_instance_type=t2.micro" \
  -var="bastion_instance_type=t2.small"
```

## 인프라 삭제 (비용 절약)

### 전체 인프라 삭제
```bash
# 메인 인프라 삭제
cd infrastructure/terraform
terraform destroy -var="db_password=SecurePassword123!"

# Bootstrap 삭제 (마지막에 실행)
cd bootstrap
terraform destroy

# 생성된 키 파일 삭제
rm -f clouddoctor-prod-key.pem
```

### 선택적 리소스 삭제
```bash
# 특정 리소스만 삭제
terraform destroy -target=module.ec2
terraform destroy -target=module.rds
terraform destroy -target=module.elasticache
```

## 문제 해결

### 일반적인 오류

#### 1. AWS 자격증명 오류
```bash
# 오류: Unable to locate credentials
aws configure list
aws sts get-caller-identity
```

#### 2. 권한 부족 오류
```bash
# IAM 사용자에 AdministratorAccess 정책 연결 필요
# 또는 최소 권한: EC2, VPC, RDS, ElastiCache, S3, IAM, Route53
```

#### 3. 리전 오류
```bash
# 오류: region not found
export AWS_DEFAULT_REGION=ap-northeast-2
aws configure set region ap-northeast-2
```

#### 4. 키 페어 권한 오류
```bash
# SSH 키 권한 설정
chmod 400 clouddoctor-prod-key.pem
```

#### 5. Terraform 상태 오류
```bash
# 상태 파일 초기화
terraform refresh
terraform state list

# 상태 파일 재생성
terraform import aws_instance.example i-1234567890abcdef0
```

### 보안 고려사항

#### 1. AWS 자격증명 보안
- Access Key 노출 방지
- IAM 역할 사용 권장
- MFA 활성화 권장

#### 2. 네트워크 보안
- Bastion 호스트를 통한 SSH 접속
- Security Group 최소 권한 원칙
- VPC 내부 통신만 허용

#### 3. 데이터베이스 보안
- RDS 암호화 활성화
- 강력한 비밀번호 사용
- 정기 백업 설정

## 모니터링 및 로그

### CloudWatch 로그 확인
```bash
# EC2 인스턴스 로그
aws logs describe-log-groups
aws logs get-log-events --log-group-name /aws/ec2/clouddoctor

# RDS 로그
aws rds describe-db-log-files --db-instance-identifier clouddoctor-prod
```

### 성능 모니터링
- CloudWatch 대시보드
- ALB 타겟 그룹 헬스체크
- RDS 성능 인사이트
- ElastiCache 메트릭

## 백업 및 복구

### RDS 스냅샷 생성
```bash
aws rds create-db-snapshot \
  --db-instance-identifier clouddoctor-prod \
  --db-snapshot-identifier clouddoctor-backup-$(date +%Y%m%d)
```

### S3 백업
```bash
# 애플리케이션 데이터 백업
aws s3 sync s3://clouddoctor-bucket ./backup/
```

### Terraform 상태 백업
```bash
# S3에 자동 백업됨 (backend 설정)
aws s3 ls s3://clouddoctor-terraform-state-xxxxxxxx/
```