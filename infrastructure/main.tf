terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.14"
    }
  }

  // TF does not allow vars here. Use main vars or module outputs for other variables
  backend "s3" {
    bucket = "tnc-blue-carbon-cost-tool-terraform-state"
    key = "state"
    region = "eu-west-3"
    profile = "tnc-blue-carbon-cost-tool"
    dynamodb_table = "tnc-blue-carbon-cost-tool-terraform-state-lock"
  }

  required_version = "~> 1.9.0"
}

## Networking

data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_availability_zones" "all_available_azs" {
  state = "available"
}

# THIS IS TO FILTER THE AVAILABLE ZONES BY EC2 INSTANCE TYPE AVAILABILITY
# returns zone ids that have the requested instance type available
data "aws_ec2_instance_type_offerings" "azs_with_ec2_instance_type_offering" {
  filter {
    name   = "instance-type"
    values = ["t3.medium"]
  }

  filter {
    name   = "location"
    values = data.aws_availability_zones.all_available_azs.zone_ids
  }

  location_type = "availability-zone-id"
}

# THIS IS TO FIND THE NAMES OF THOSE ZONES GIVEN BY IDS FROM ABOVE...
data "aws_availability_zones" "azs_with_ec2_instance_type_offering" {
  filter {
    name   = "zone-id"
    values = sort(data.aws_ec2_instance_type_offerings.azs_with_ec2_instance_type_offering.locations)
  }
}

# THIS IS TO FILTER THE SUBNETS BY AVAILABILITY ZONES WITH EC2 INSTANCE TYPE AVAILABILITY
# so that we know which subnets can be passed to the beanstalk resource without upsetting it
data "aws_subnets" "subnets_with_ec2_instance_type_offering_map" {
  for_each = toset(
    data.aws_ec2_instance_type_offerings.azs_with_ec2_instance_type_offering.locations
  )

  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default_vpc.id]
  }

  filter {
    name   = "availability-zone-id"
    values = ["${each.value}"]
  }
}

locals {
  subnets_with_ec2_instance_type_offering_ids = sort([
    for k, v in data.aws_subnets.subnets_with_ec2_instance_type_offering_map : v.ids[0]
  ])
}


module state {
  source = "./modules/state"
  state_project_name = var.project_name
  state_aws_region = var.aws_region
  state_aws_profile = var.aws_profile
}

module client_ecr {
  source = "./modules/ecr"
  project_name = var.project_name
  ecr_repo_name = "client"
}

module api_ecr {
  source = "./modules/ecr"
  project_name = var.project_name
  ecr_repo_name = "api"
}

module "iam" {
  source = "./modules/iam"
}

resource "aws_iam_service_linked_role" "elasticbeanstalk" {
  aws_service_name = "elasticbeanstalk.amazonaws.com"
}

module "dev" {
  source                                        = "./modules/env"
  domain                                        = "dev.blue-carbon-cost-tool.dev-vizzuality.com"
  project                                       = var.project_name
  environment                                   = "dev"
  aws_region                                    = var.aws_region
  vpc                                           = data.aws_vpc.default_vpc
  subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform                            = "64bit Amazon Linux 2023 v4.3.6 running Docker"
  beanstalk_tier                                = "WebServer"
  ec2_instance_type                             = "t3.medium"
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
  cname_prefix                                  = "blue-carbon-cost-tool-dev-environment"
  rds_instance_class = "db.t3.micro"
  rds_engine_version = "15.5"
  rds_backup_retention_period = 3
  repo_name                                     = var.project_name
  github_owner                                  = var.github_owner
  github_token                                  = var.github_token
}

module "github" {
  source       = "./modules/github"
  repo_name    = var.project_name
  github_owner = var.github_owner
  github_token = var.github_token
  global_secret_map = {}
}



