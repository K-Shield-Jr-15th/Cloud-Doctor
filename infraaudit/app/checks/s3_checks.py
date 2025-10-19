from .base_check import BaseCheck
from typing import List, Dict
import json

# 
# 항목 8번: S3 버킷 정책 Principal 점검
#
class S3BucketPolicyCheck(BaseCheck):
    """
    [항목 가이드 2.1] S3 버킷 정책의 공개 설정과 Get/Put 권한으로 인한 데이터 탈취/악성코드 주입 위협
    - 점검 기준: 버킷 정책에서 "Principal": "*" 이거나 "Effect": "Allow" 이고, 
                 Action에 s3:GetObject 또는 s3:PutObject가 포함되어 있으면 취약합니다.
    """
    def get_result(self, status: str, resource_id: str, message: str, details: Dict = None) -> Dict:
        return {
            'check_id': 's3_bucket_policy',
            'status': status,
            'resource_id': resource_id,
            'message': message,
            'details': details or {}
        }
    async def check(self) -> Dict:
        s3 = self.session.client('s3')
        results = []
        raw = [] # 점검한 모든 리소스의 로우데이터
        
        try:
            buckets = s3.list_buckets()
            
            if not buckets.get('Buckets', []):
                results.append(self.get_result(
                    'PASS', 'N/A', "S3 버킷이 존재하지 않습니다."
                ))
                return {'results': results, 'raw': raw, 'guideline_id': 8}
                
            for bucket in buckets.get('Buckets', []):
                bucket_name = bucket['Name']
                is_vulnerable = False
                policy_str = None
                policy = None
                
                raw_data = {
                    'bucket_name': bucket_name,
                    'policy': None,
                    'bucket_data': bucket
                }
                
                try:
                    policy_str = s3.get_bucket_policy(Bucket=bucket_name)['Policy']
                    policy = json.loads(policy_str) # JSON 객체로 파싱
                    raw_data['policy'] = policy # 로우데이터에 정책 추가
                    
                    vulnerable_statements = []
                    
                    for stmt in policy.get('Statement', []):
                        if stmt.get('Effect') == 'Allow':
                            # 1. Principal이 '*' (전체 공개)인지 확인
                            principal = stmt.get('Principal')
                            is_public_principal = (principal == '*' or 
                                                   (isinstance(principal, dict) and principal.get('AWS') == '*'))
                            
                            if is_public_principal:
                                # 2. Action에 GetObject 또는 PutObject가 있는지 확인
                                actions = stmt.get('Action', [])
                                if not isinstance(actions, list):
                                    actions = [actions]
                                
                                has_dangerous_action = any(
                                    a in ['s3:GetObject', 's3:PutObject', 's3:*'] for a in actions
                                )
                                
                                if has_dangerous_action:
                                    is_vulnerable = True
                                    vulnerable_statements.append(stmt) # 취약한 정책 구문 저장
                    
                    if is_vulnerable:
                        results.append(self.get_result(
                            'FAIL', bucket_name,
                            f"버킷 {bucket_name} 정책에 공개 Get/Put 권한이 포함되어 취약합니다.",
                            # details에 파싱된 전체 정책과 취약한 구문을 포함
                            {'policy': policy, 'vulnerable_statements': vulnerable_statements}
                        ))
                    else:
                        results.append(self.get_result(
                            'PASS', bucket_name,
                            f"버킷 {bucket_name} 정책이 공개된 Get/Put 권한을 허용하지 않습니다.",
                            {'policy': policy}
                        ))
                        
                except s3.exceptions.ClientError as e:
                    if e.response['Error']['Code'] == 'NoSuchBucketPolicy':
                        results.append(self.get_result(
                            'PASS', bucket_name,
                            f"버킷 {bucket_name}에 버킷 정책이 없습니다.",
                            {'policy': None}
                        ))
                    else:
                        results.append(self.get_result('ERROR', bucket_name, str(e)))
                except Exception as e:
                    results.append(self.get_result('ERROR', bucket_name, str(e)))
                
                raw.append(raw_data) # 점검한 버킷의 로우데이터 추가
                
        except Exception as e:
            results.append(self.get_result('ERROR', 'N/A', str(e)))
        
        return {'results': results, 'raw': raw, 'guideline_id': 8}

#
# 항목 9번: S3 Public ACL 점검
#
class S3PublicAccessCheck(BaseCheck):
    """
    [항목 가이드 2.2] S3 객체/버킷 ACL에 의한 외부 접근 허용 및 정보유출 위험
    - 점검 기준: 객체/버킷 ACL의 All Users 또는 Authenticated users가 권한을 가지고 있으면 취약합니다.
    """
    def get_result(self, status: str, resource_id: str, message: str, details: Dict = None) -> Dict:
        return {
            'check_id': 's3_public_access',
            'status': status,
            'resource_id': resource_id,
            'message': message,
            'details': details or {}
        }
    async def check(self) -> Dict:
        s3 = self.session.client('s3')
        results = []
        raw = [] # 점검한 모든 리소스의 로우데이터
        
        public_acl_uris = [
            "http://acs.amazonaws.com/groups/global/AllUsers",
            "http://acs.amazonaws.com/groups/global/AuthenticatedUsers"
        ]
        
        try:
            buckets = s3.list_buckets()
            
            if not buckets.get('Buckets', []):
                results.append(self.get_result(
                    'PASS', 'N/A', "S3 버킷이 존재하지 않습니다."
                ))
                return {'results': results, 'raw': raw, 'guideline_id': 9}
                
            for bucket in buckets.get('Buckets', []):
                bucket_name = bucket['Name']
                acl = None
                
                raw_data = {
                    'bucket_name': bucket_name,
                    'acl': None,
                    'bucket_data': bucket
                }
                
                try:
                    acl = s3.get_bucket_acl(Bucket=bucket_name) # API 응답 저장
                    raw_data['acl'] = acl # 로우데이터에 ACL 추가
                    
                    public_grants = []
                    
                    for grant in acl.get('Grants', []):
                        grantee = grant.get('Grantee', {})
                        if (grantee.get('Type') == 'Group' and 
                            grantee.get('URI') in public_acl_uris):
                            permission = grant.get('Permission')
                            # 점검 기준의 'List', 'Read', 'Write' 및 위험 권한(ACP) 확인
                            if permission in ['READ', 'WRITE', 'READ_ACP', 'WRITE_ACP']:
                                public_grants.append(permission)
                    
                    unique_public_grants = list(set(public_grants))
                    if public_grants:
                        results.append(self.get_result(
                            'FAIL', bucket_name,
                            f"버킷 {bucket_name}의 ACL에 공용 권한이 부여되어 취약합니다: {', '.join(unique_public_grants)}",
                            # details에 전체 ACL 응답과 파싱된 취약 권한 목록을 포함
                            {'acl': acl, 'public_grants': unique_public_grants}
                        ))
                    else:
                        results.append(self.get_result(
                            'PASS', bucket_name,
                            f"버킷 {bucket_name}의 ACL에 공용 권한이 없습니다.",
                            {'acl': acl}
                        ))
                        
                except Exception as e:
                    if "AccessDenied" in str(e):
                        results.append(self.get_result(
                            'PASS', bucket_name,
                            f"Could not access ACL for bucket {bucket_name}. Assuming non-public ACL.",
                            {'acl': None}
                        ))
                    else:
                        results.append(self.get_result('ERROR', bucket_name, str(e)))
                
                raw.append(raw_data) # 점검한 버킷의 로우데이터 추가

        except Exception as e:
            results.append(self.get_result('ERROR', 'N/A', str(e)))
        
        return {'results': results, 'raw': raw, 'guideline_id': 9}

#
# 항목 11번: S3 복제 규칙 IAM 역할 점검
#
class S3ReplicationRoleCheck(BaseCheck):
    """
    [항목 가이드 2.3] S3 버킷 복제 권한 악용에 의한 데이터 유출 위험
    - 점검 기준: S3 복제 규칙의 대상 버킷 ARN이 허용 대상에 포함되어 있지 않으면 취약합니다.
    """
    def get_result(self, status: str, resource_id: str, message: str, details: Dict = None) -> Dict:
        return {
            'check_id': 's3_replication_role',
            'status': status,
            'resource_id': resource_id,
            'message': message,
            'details': details or {}
        }
    
    def _check_policy_doc(self, policy_doc, dest_bucket_arn):
        """Helper: 정책 문서에 대상 버킷 ARN이 Resource로 명시되었는지 확인"""
        if not policy_doc or not dest_bucket_arn:
            return False
        
        target_resource = f"{dest_bucket_arn}/*" # 대상 버킷 리소스 ARN

        for stmt in policy_doc.get('Statement', []):
            if stmt.get('Effect') == 'Allow':
                actions = stmt.get('Action', [])
                if not isinstance(actions, list):
                    actions = [actions]
                
                has_replication_action = any(
                    a in ['s3:ReplicateObject', 's3:ReplicateDelete', 's3:*'] for a in actions
                )
                
                if has_replication_action:
                    resources = stmt.get('Resource', [])
                    if not isinstance(resources, list):
                        resources = [resources]
                    
                    if target_resource in resources:
                        return True
        
        return False

    async def check(self) -> Dict:
        s3 = self.session.client('s3')
        iam = self.session.client('iam')
        results = []
        raw = [] # 점검한 모든 리소스의 로우데이터
        
        try:
            buckets = s3.list_buckets()
            
            if not buckets.get('Buckets', []):
                results.append(self.get_result(
                    'PASS', 'N/A', "S3 버킷이 존재하지 않습니다."
                ))
                return {'results': results, 'raw': raw, 'guideline_id': 11}
                
            for bucket in buckets.get('Buckets', []):
                bucket_name = bucket['Name']
                replication_config = None
                
                raw_data = {
                    'bucket_name': bucket_name,
                    'replication_configuration': None,
                    'scanned_iam_policies': [],
                    'bucket_data': bucket
                }
                
                try:
                    replication_config = s3.get_bucket_replication(Bucket=bucket_name)
                    raw_data['replication_configuration'] = replication_config.get('ReplicationConfiguration')
                    
                    role_arn = replication_config.get('ReplicationConfiguration', {}).get('Role')
                    rules = replication_config.get('ReplicationConfiguration', {}).get('Rules', [])
                    
                    if not role_arn or not rules:
                        results.append(self.get_result(
                            'PASS', bucket_name,
                            f"버킷 {bucket_name}에 복제 설정이 없습니다.",
                            {'replication_configuration': None}
                        ))
                        raw.append(raw_data)
                        continue

                    dest_bucket_arn = rules[0].get('Destination', {}).get('Bucket')
                    if not dest_bucket_arn:
                        results.append(self.get_result(
                            'WARN', bucket_name,
                            f"버킷 {bucket_name} 복제 규칙에 대상 버킷이 지정되지 않았습니다.",
                            {'replication_configuration': replication_config.get('ReplicationConfiguration')}
                        ))
                        raw.append(raw_data)
                        continue

                    role_name = role_arn.split('/')[-1]
                    policy_is_restricted = False
                    scanned_policies = [] 

                    try:
                        # 인라인 정책 점검
                        inline_policies = iam.list_role_policies(RoleName=role_name).get('PolicyNames', [])
                        for p_name in inline_policies:
                            policy_doc = iam.get_role_policy(
                                RoleName=role_name, PolicyName=p_name
                            ).get('PolicyDocument', {})
                            scanned_policies.append({'name': p_name, 'type': 'inline', 'document': policy_doc})
                            
                            if self._check_policy_doc(policy_doc, dest_bucket_arn):
                                policy_is_restricted = True
                                break
                        
                        # 연결된 정책 점검
                        if not policy_is_restricted:
                            attached_policies = iam.list_attached_role_policies(RoleName=role_name).get('AttachedPolicies', [])
                            for p in attached_policies:
                                p_arn = p['PolicyArn']
                                p_name = p.get('PolicyName', p_arn.split('/')[-1])
                                p_version = iam.get_policy(PolicyArn=p_arn)['Policy']['DefaultVersionId']
                                policy_doc = iam.get_policy_version(
                                    PolicyArn=p_arn, VersionId=p_version
                                )['PolicyVersion'].get('Document', {})
                                scanned_policies.append({'name': p_name, 'type': 'attached', 'arn': p_arn, 'document': policy_doc})
                                
                                if self._check_policy_doc(policy_doc, dest_bucket_arn):
                                    policy_is_restricted = True
                                    break
                        
                        raw_data['scanned_iam_policies'] = scanned_policies # 로우데이터에 스캔한 정책 추가

                        if policy_is_restricted:
                            results.append(self.get_result(
                                'PASS', bucket_name,
                                f"복제 역할({role_name})이 대상 버킷({dest_bucket_arn})으로 제한됩니다.",
                                {'replication_configuration': replication_config.get('ReplicationConfiguration')}
                            ))
                        else:
                            results.append(self.get_result(
                                'FAIL', bucket_name,
                                f"복제 역할({role_name})의 Resource가 대상 버킷({dest_bucket_arn})으로 제한되지 않아 취약합니다.",
                                {
                                    'replication_configuration': replication_config.get('ReplicationConfiguration'),
                                    'scanned_iam_policies': scanned_policies
                                }
                            ))
                            
                    except Exception as e:
                        results.append(self.get_result('ERROR', bucket_name, f"IAM 역할({role_name}) 점검 중 오류: {e}"))

                except s3.exceptions.ClientError as e:
                    if e.response['Error']['Code'] == 'ReplicationConfigurationNotFoundError':
                        results.append(self.get_result(
                            'PASS', bucket_name,
                            f"버킷 {bucket_name}에 복제 설정이 없습니다.",
                            {'replication_configuration': None}
                        ))
                    else:
                        results.append(self.get_result('ERROR', bucket_name, str(e)))
                except Exception as e:
                    results.append(self.get_result('ERROR', bucket_name, str(e)))
                
                raw.append(raw_data) # 점검한 버킷의 로우데이터 추가

        except Exception as e:
            results.append(self.get_result('ERROR', 'N/A', str(e)))
        
        return {'results': results, 'raw': raw, 'guideline_id': 11}

#
# S3 암호화 점검
#
class S3EncryptionCheck(BaseCheck):
    """
    S3 버킷 암호화 설정 점검
    - 점검 기준: S3 버킷에 암호화가 설정되어 있지 않으면 취약합니다.
    """
    def get_result(self, status: str, resource_id: str, message: str, details: Dict = None) -> Dict:
        return {
            'check_id': 's3_encryption',
            'status': status,
            'resource_id': resource_id,
            'message': message,
            'details': details or {}
        }
    async def check(self) -> Dict:
        s3 = self.session.client('s3')
        results = []
        raw = []
        
        try:
            buckets = s3.list_buckets()
            
            if not buckets.get('Buckets', []):
                results.append(self.get_result(
                    'PASS', 'N/A', "S3 버킷이 존재하지 않습니다."
                ))
                return {'results': results, 'raw': raw, 'guideline_id': 10}
                
            for bucket in buckets.get('Buckets', []):
                bucket_name = bucket['Name']
                
                raw_data = {
                    'bucket_name': bucket_name,
                    'encryption': None,
                    'bucket_data': bucket
                }
                
                try:
                    encryption = s3.get_bucket_encryption(Bucket=bucket_name)
                    raw_data['encryption'] = encryption
                    
                    results.append(self.get_result(
                        'PASS', bucket_name,
                        f"버킷 {bucket_name}에 암호화가 설정되어 있습니다.",
                        {'encryption': encryption}
                    ))
                        
                except s3.exceptions.ClientError as e:
                    if e.response['Error']['Code'] == 'ServerSideEncryptionConfigurationNotFoundError':
                        results.append(self.get_result(
                            'FAIL', bucket_name,
                            f"버킷 {bucket_name}에 암호화가 설정되어 있지 않아 취약합니다.",
                            {'encryption': None}
                        ))
                    else:
                        results.append(self.get_result('ERROR', bucket_name, str(e)))
                except Exception as e:
                    results.append(self.get_result('ERROR', bucket_name, str(e)))
                
                raw.append(raw_data)

        except Exception as e:
            results.append(self.get_result('ERROR', 'N/A', str(e)))
        
        return {'results': results, 'raw': raw, 'guideline_id': 10}