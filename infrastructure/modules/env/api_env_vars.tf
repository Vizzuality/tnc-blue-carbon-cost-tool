resource "random_password" "access_token_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "reset_password_token_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}
resource "random_password" "email_confirmation_token_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "aws_iam_access_key" "email_user_access_key" {
  user = module.email.iam_user.name
}

locals {
  api_secret_env_vars = {
    DB_HOST = module.postgresql.host
    DB_NAME = module.postgresql.db_name
    DB_PASSWORD = module.postgresql.password
    DB_USERNAME = module.postgresql.username
    DB_PORT = module.postgresql.port
    ACCESS_TOKEN_SECRET = random_password.access_token_secret.result
    ACCESS_TOKEN_EXPIRES_IN = "24h"
    RESET_PASSWORD_TOKEN_SECRET = random_password.reset_password_token_secret.result
    RESET_PASSWORD_TOKEN_EXPIRES_IN = "24h"
    EMAIL_CONFIRMATION_TOKEN_SECRET = random_password.email_confirmation_token_secret.result
    EMAIL_CONFIRMATION_TOKEN_EXPIRES_IN = "24h"
    SIGN_UP_TOKEN_SECRET = random_password.email_confirmation_token_secret.result
    SIGN_UP_TOKEN_EXPIRES_IN = "24h"
    AWS_SES_ACCESS_KEY_ID = aws_iam_access_key.email_user_access_key.id
    AWS_SES_ACCESS_KEY_SECRET = aws_iam_access_key.email_user_access_key.secret
    AWS_SES_DOMAIN = module.email.mail_from_domain
  }
  api_env_vars = {

  }
}