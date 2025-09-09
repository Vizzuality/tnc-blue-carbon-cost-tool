resource "random_string" "next_auth_secret" {
  length  = 64
  special = true
}


locals {
  client_secret_env_vars = {
    NEXTAUTH_SECRET = random_string.next_auth_secret.result
    BASIC_AUTH_USER = var.basic_auth_user
    BASIC_AUTH_PASSWORD = var.basic_auth_password
  }
  client_env_vars = {
    NEXT_PUBLIC_API_URL = "https://${var.domain}/api"
    NEXTAUTH_URL        = "https://${var.domain}"
    BASIC_AUTH_ENABLED = var.basic_auth_enabled ? "true" : "false"
  }
}