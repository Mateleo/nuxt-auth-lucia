import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 465, // or your SMTP port
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Shared styling constants
const styles = {
    backgroundColor: '#f9fafb',
    textColor: '#1f2937',
    primaryColor: '#3b82f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};


// Common email wrapper
function createEmailWrapper(content: string) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: ${styles.backgroundColor};
  font-family: ${styles.fontFamily};
  color: ${styles.textColor};
">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
          <tr>
            <td style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
              <p>If you didn't request this email, please ignore it.</p>
              <p>&copy; ${new Date().getFullYear()} NuxtAuthLucia. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export async function sendVerificationEmailWithNodemailer(to: string, verificationCode: string): Promise<void> {
    const html = createEmailWrapper(`
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://nuxt.com/assets/design-kit/icon-green.png" alt="NuxtAuthLucia" style="max-height: 50px; margin-bottom: 20px;">
        </div>
        <h1 style="margin-bottom: 24px; font-size: 24px; font-weight: 600; text-align: center;">
          Your verification code
        </h1>
        <p style="margin-bottom: 24px; font-size: 16px; line-height: 24px;">
          Enter the following verification code to confirm your email address:
        </p>
        <div style="
          margin: 32px 0;
          padding: 16px;
          background-color: ${styles.backgroundColor};
          border-radius: 4px;
          text-align: center;
          letter-spacing: 8px;
          font-size: 32px;
          font-weight: 700;
        ">
          ${verificationCode}
        </div>
        <p style="margin-bottom: 24px; font-size: 16px; line-height: 24px;">
          This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
        </p>
      `);

    const text = `
    Welcome to NuxtAuthLucia!
    
    Your verification code is: ${verificationCode}
    
    Enter this code in the verification page to confirm your email address.
    This code will expire in 10 minutes.
    
    If you didn't create an account with us, please ignore this email.
    
    Best regards,
    The NuxtAuthLucia Team
      `;

    const mailOptions = {
        from: `"NuxtAuthLucia" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: 'Email Verification',
        text: text,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}