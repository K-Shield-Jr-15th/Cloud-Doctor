from fastapi import APIRouter, HTTPException
from app.models.audit import AuditRequest, AuditResponse
from app.services.audit_service import AuditService

router = APIRouter()
audit_service = AuditService()

@router.post("/start", response_model=AuditResponse)
async def start_audit(request: AuditRequest):
    try:
        result = await audit_service.run_audit(
            request.account_id,
            request.role_name,
            request.checks,
            request.external_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{audit_id}", response_model=AuditResponse)
async def get_audit_status(audit_id: str):
    try:
        status = audit_service.get_audit_status(audit_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/checks")
async def get_available_checks():
    """사용 가능한 체크 목록을 반환합니다."""
    checks = {
        "iam": {
            "iam_access_key_age": "IAM 액세스 키 사용 기간 점검",
            "iam_root_access_key": "루트 계정 액세스 키 점검",
            "iam_root_mfa": "루트 계정 MFA 점검"
        },
        "s3": {
            "s3_bucket_policy": "S3 버킷 정책 공개 설정 점검",
            "s3_public_access": "S3 버킷 공개 ACL 점검",
            "s3_replication_role": "S3 복제 규칙 IAM 역할 점검",
            "s3_encryption": "S3 버킷 암호화 설정 점검"
        },
        "ec2": {
            "ec2_imdsv2": "EC2 IMDSv2 설정 점검",
            "ec2_public_ip": "EC2 퍼블릭 IP 점검",
            "ec2_ami_private": "EC2 AMI 프라이빗 설정 점검",
            "ebs_snapshot_private": "EBS 스냅샷 프라이빗 설정 점검"
        }
    }
    return checks
