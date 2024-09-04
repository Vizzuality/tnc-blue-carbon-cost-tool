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

module state {
  source = "./modules/state"
  state_project_name = var.project_name
  state_aws_region = var.aws_region
  state_aws_profile = var.aws_profile
}

