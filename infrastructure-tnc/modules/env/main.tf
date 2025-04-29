

module "beanstalk" {
  source                                        = "../beanstalk"
  project                                       = var.project
  environment                                   = var.environment
  region                                        = var.aws_region
  application_name                              = "${var.project}-${var.environment}"
  application_environment                       = "${var.project}-${var.environment}-env"
  solution_stack_name                           = var.beanstalk_platform
  tier                                          = var.beanstalk_tier
  tags                                          = var.tags
  vpc                                           = var.vpc
  public_subnets                                = var.subnet_ids
  elb_public_subnets                            = var.subnet_ids
  ec2_instance_type                             = var.ec2_instance_type
  acm_certificate                               = aws_acm_certificate.acm_certificate
  elasticbeanstalk_iam_service_linked_role_name = var.elasticbeanstalk_iam_service_linked_role_name
  cname_prefix                                  = var.cname_prefix
}

module "postgresql" {
  source                      = "../rds"
  log_retention_period        = var.rds_log_retention_period
  subnet_ids                  = var.subnet_ids
  project                     = var.project
  environment                 = var.environment
  rds_backup_retention_period = var.rds_backup_retention_period
  rds_user_name               = "postgres"
  rds_engine_version          = var.rds_engine_version
  rds_instance_class          = var.rds_instance_class
  rds_instance_count          = var.rds_instance_count
  tags                        = var.tags
  vpc_id                      = var.vpc.id
  rds_port                    = 5432
  vpc_cidr_block              = var.vpc.cidr_block
  availability_zones          = var.availability_zones
  database_name               = var.project
}


module "github" {
  source                   = "../github"
  repo_name                = var.repo_name
  github_owner             = var.github_owner
  github_token             = var.github_token
  github_environment       = var.environment
  environment_secret_map   = merge(local.api_secret_env_vars, local.client_secret_env_vars, var.github_additional_environment_secrets)
  environment_variable_map = merge(local.api_env_vars, local.client_env_vars, var.github_additional_environment_variables)
}

module "email" {
  source = "../email"
  domain = var.domain
  region = var.aws_region
}




