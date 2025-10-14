-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cloud providers table
CREATE TABLE cloud_providers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true
);

-- Cloud accounts table
CREATE TABLE cloud_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id BIGINT NOT NULL REFERENCES cloud_providers(id),
    account_name VARCHAR(100) NOT NULL,
    access_key VARCHAR(255),
    secret_key VARCHAR(255),
    region VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE resources (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES cloud_accounts(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    resource_name VARCHAR(255),
    status VARCHAR(50),
    cost_per_hour DECIMAL(10,4),
    tags JSONB,
    metadata JSONB,
    last_scanned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health checks table
CREATE TABLE health_checks (
    id BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    check_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    message TEXT,
    severity VARCHAR(20) DEFAULT 'INFO',
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial cloud providers
INSERT INTO cloud_providers (name, display_name, icon_url) VALUES
('aws', 'Amazon Web Services', '/icons/aws.png'),
('azure', 'Microsoft Azure', '/icons/azure.png'),
('gcp', 'Google Cloud Platform', '/icons/gcp.png');

-- Create indexes
CREATE INDEX idx_cloud_accounts_user_id ON cloud_accounts(user_id);
CREATE INDEX idx_resources_account_id ON resources(account_id);
CREATE INDEX idx_health_checks_resource_id ON health_checks(resource_id);
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_health_checks_status ON health_checks(status);