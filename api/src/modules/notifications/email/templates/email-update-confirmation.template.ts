export const EMAIL_UPDATE_CONFIRMATION_HTML_CONTENT = (
  url,
  expiration,
): string => `
    <h1>Dear User,</h1>
    <br/>
    <p>We have received a request to change the email address associated with your account. If you initiated this request, please confirm the change by clicking the link below:</p>
    <br/>
    <p><a href="${url}" target="_blank" rel="noopener noreferrer">Confirm Email Change</a></p>
    <br/>
    <p>This link will redirect you to our app to confirm the new email address. For security reasons, this link will expire in ${expiration}.</p>
    <p>If you did not request this email change, please ignore this message; your account information will remain unchanged.</p>
    <br/>
    <p>Thank you for using our platform. We value your security and account privacy.</p>
    <p>Best regards.</p>`;
