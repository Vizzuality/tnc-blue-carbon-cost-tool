terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14"
    }
  }

  // TF does not allow vars here. Use main vars or module outputs for other variables
  backend "s3" {
    bucket         = "blue-carbon-cost-terraform-state"
    key            = "state"
    region         = "us-east-2"
    profile        = "tnc-aws"
    dynamodb_table = "blue-carbon-cost-terraform-state-lock"
  }

  required_version = "~> 1.9.0"
}

module "state" {
  source             = "./modules/state"
  state_project_name = var.project_name
  state_aws_region   = var.aws_region
  state_aws_profile  = var.aws_profile
}

module "client_ecr" {
  source        = "./modules/ecr"
  project_name  = var.project_name
  ecr_repo_name = "client"
}

module "api_ecr" {
  source        = "./modules/ecr"
  project_name  = var.project_name
  ecr_repo_name = "api"
}

module "admin_ecr" {
  source        = "./modules/ecr"
  project_name  = var.project_name
  ecr_repo_name = "admin"
}

module "iam" {
  source = "./modules/iam"
}


module "vpc" {
  source  = "./modules/vpc"
  project = var.project_name
}

module "dev" {
  source      = "./modules/env"
  domain      = "dev.${var.project_name}.${var.domain}"
  project     = var.project_name
  environment = "dev"

  aws_region = var.aws_region

  vpc                = module.vpc.vpc
  subnet_ids         = module.vpc.public_subnet_ids
  availability_zones = module.vpc.availability_zones

  beanstalk_platform = "64bit Amazon Linux 2023 v4.5.0 running Docker"
  beanstalk_tier     = "WebServer"
  ec2_instance_type  = "t3.medium"

  elasticbeanstalk_iam_service_linked_role_name = "AWSServiceRoleForElasticBeanstalk"
  cname_prefix                                  = "${var.project_name}-dev-environment"

  rds_instance_class          = "db.t3.micro"
  rds_engine_version          = "15.7"
  rds_backup_retention_period = 3

  repo_name    = "tnc-blue-carbon-cost-tool"
  github_owner = var.github_owner
  github_token = var.github_token

  github_additional_environment_variables = {
    JWT_EXPIRES_IN = "1d"
  }
}


module "staging" {
  source      = "./modules/env"
  domain      = "staging.${var.project_name}.${var.domain}"
  project     = var.project_name
  environment = "staging"

  aws_region = var.aws_region

  vpc                = module.vpc.vpc
  subnet_ids         = module.vpc.public_subnet_ids
  availability_zones = module.vpc.availability_zones

  beanstalk_platform = "64bit Amazon Linux 2023 v4.5.0 running Docker"
  beanstalk_tier     = "WebServer"
  ec2_instance_type  = "t3.medium"

  elasticbeanstalk_iam_service_linked_role_name = "AWSServiceRoleForElasticBeanstalk"
  cname_prefix                                  = "${var.project_name}-staging-environment"

  rds_instance_class          = "db.t3.micro"
  rds_engine_version          = "15.7"
  rds_backup_retention_period = 3

  repo_name    = "tnc-blue-carbon-cost-tool"
  github_owner = var.github_owner
  github_token = var.github_token

  github_additional_environment_variables = {
    JWT_EXPIRES_IN = "1d"
  }
}

module "github" {
  source       = "./modules/github"
  repo_name    = "tnc-blue-carbon-cost-tool"
  github_owner = var.github_owner
  github_token = var.github_token
  global_secret_map = {
    PROJECT_NAME                    = var.project_name
    PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
    PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
    CLIENT_REPOSITORY_NAME          = module.client_ecr.repository_name
    API_REPOSITORY_NAME             = module.api_ecr.repository_name
    ADMIN_REPOSITORY_NAME           = module.admin_ecr.repository_name
    AWS_REGION                      = var.aws_region
  }
  global_variable_map = {
    NEXT_PUBLIC_MAPBOX_API_TOKEN = var.mapbox_api_token
  }
}
