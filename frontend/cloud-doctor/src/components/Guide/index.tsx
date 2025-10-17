import { Link } from "react-router-dom";

export default function Index() {
  return (
    <main>
      <section
        id="Guide"
        className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-12"
      >
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-beige to-primary-light bg-clip-text text-transparent">
            📖 AWS 보안 가이드
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={`/guide/EC2`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/ec2.png"
                />
                <div>
                  <h3 className="text-lg font-bold text-beige mb-1">EC2</h3>
                  <p className="text-xs text-slate-400">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/S3`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/s3.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">S3</h3>
                  <p className="text-sm text-gray-600">No. 3 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/IAM`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/iam.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">IAM</h3>
                  <p className="text-sm text-gray-600">No. 3 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/VPC`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/vpc.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">VPC</h3>
                  <p className="text-sm text-gray-600">No. 3 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Lambda`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/lambda.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">Lambda</h3>
                  <p className="text-sm text-gray-600">No. 3 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/RDS`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/rds.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">RDS</h3>
                  <p className="text-sm text-gray-600">No. 3 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/CloudTrail`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/cloudtrail.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    CloudTrail
                  </h3>
                  <p className="text-sm text-gray-600">No. 3 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/EKS`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/eks.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">EKS</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/KMS`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/kms.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">KMS</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/SNS`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/sns.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">SNS</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/SQS`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/sqs.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">SQS</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Route53`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/route53.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">Route53</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Organizations`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/organizations.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    Organizations
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/ECR`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/ecr.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">ECR</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/SSM`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/ssm.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">SSM</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/GuardDuty`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/guardduty.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    GuardDuty
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Cognito`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/cognito.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">Cognito</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/CloudFormation`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/cloudformation.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    CloudFormation
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/OpenSearch`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/opensearch.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    OpenSearch
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Elastic Beanstalk`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/elasticbeanstalk.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    Elastic Beanstalk
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Redshift`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/redshift.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    Redshift
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Glue`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/glue.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">Glue</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Service Catalog`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/servicecatalog.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    Service Catalog
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/DocumentDB`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/documentDB.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    DocumentDB
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/Bedrock`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/bedrock.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">Bedrock</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/SES`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/ses.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">SES</h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>

            <Link
              to={`/guide/AppStream 2.0`}
              className="block p-4 bg-primary-dark/50 backdrop-blur-xl border border-primary rounded-2xl shadow-xl hover:bg-primary-dark/70 hover:border-accent transition-all hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  alt=""
                  src="/img/appstream2.0.png"
                />
                <div>
                  <h3 className="text-xl font-bold text-beige mb-2">
                    AppStream 2.0
                  </h3>
                  <p className="text-sm text-gray-600">No. 4 · 2025</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export { Index as Guide };
