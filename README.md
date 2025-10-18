# Cloud Doctor

## 개발 환경 설정

### SSL 인증서 설정 (mkcert)

로컬 개발 환경에서 HTTPS와 쿠키 처리를 위해 mkcert를 사용합니다.

#### 1. mkcert 설치

**macOS:**
```bash
brew install mkcert
```

**Windows:**
```bash
choco install mkcert
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v*-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

#### 2. 로컬 CA 설치
```bash
mkcert -install
```

#### 3. localhost 인증서 생성 (이미 생성됨)
```bash
# 프로젝트 루트에서 실행 (이미 완료)
mkcert localhost 127.0.0.1 ::1
```

### 프론트엔드 개발 서버 실행

```bash
cd frontend/cloud-doctor
npm install
npm run start:https
```

이제 https://localhost:3001 에서 접속 가능하며, 백엔드와의 쿠키 처리가 정상적으로 작동합니다.

### 주의사항

- 다른 개발자는 각자의 환경에서 mkcert 설치 및 설정이 필요합니다
- 인증서 파일(localhost.pem, localhost-key.pem)은 이미 프로젝트에 포함되어 있습니다
- 프로덕션 환경에서는 실제 SSL 인증서를 사용해야 합니다