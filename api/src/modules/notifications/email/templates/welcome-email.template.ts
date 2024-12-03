export const WELCOME_EMAIL_HTML_CONTENT = (
  url: string,
  expiration: string,
  oneTimePassword: string,
): string => `
    <h1>Dear User,</h1>
    <br/>
    <p>Welcome to the TNC Blue Carbon Cost Tool Platform</p>
    <br/>
    <p>Thank you for signing up. We're excited to have you on board. Please activate your account by signing up and adding a password of your choice.</p>
    <p><a href="${url}" target="_blank" rel="noopener noreferrer">Sign Up Link</a></p>
    <br/>
    <p>Your one-time password is ${oneTimePassword}</p>
    <p>For security reasons, this link will expire after ${expiration}.</p>
    <br/>
    <p>Thank you for using the platform. We're committed to ensuring your account's security.</p>
    <p>Best regards.</p>`;
