
resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}


locals {
  api_secret_env_vars = {
    DB_HOST = module.postgresql.host
    DB_NAME = module.postgresql.db_name
    DB_PASSWORD = module.postgresql.password
    DB_USERNAME = module.postgresql.username
    DB_PORT = module.postgresql.port
    JWT_SECRET = random_password.jwt_secret.result
  }
  api_env_vars = {

  }
}