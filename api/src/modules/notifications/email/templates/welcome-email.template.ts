export const WELCOME_EMAIL_HTML_CONTENT = (url, expiration): string => `
    <h1>Dear User,</h1>
    <br/>
    <p>We recently received a request to reset your password for your account. If you made this request, please click on the link below to securely change your password:</p>
    <br/>
    <p><a href="${url}" target="_blank" rel="noopener noreferrer">Secure Password Reset Link</a></p>
    <br/>
    <p>This link will direct you to our app to create a new password. For security reasons, this link will expire after ${expiration}.</p>
    <p>If you did not request a password reset, please ignore this email; your password will remain the same.</p>
    <br/>
    <p>Thank you for using the platform. We're committed to ensuring your account's security.</p>
    <p>Best regards.</p>`;
