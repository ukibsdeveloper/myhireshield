import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email function
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  // 1. WELCOME EMAIL (Wahi hai jo aapka tha)
  welcome: (userName, userRole) => ({
    subject: 'Welcome to MyHireShield! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #496279 0%, #4c8051 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fcfaf9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; }
          .button { display: inline-block; padding: 12px 30px; background: #496279; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to HireShield</h1>
            <p>The Standard for Professional Trust.</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Your node has been successfully integrated into the HireShield Intelligence Network as a <strong>${userRole}</strong>.</p>
            <p>Get started by completing your dashboard verification.</p>
            <a href="${process.env.FRONTEND_URL}/login" class="button">Access Terminal</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 HireShield Intelligence Network. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // 2. NEW: EMPLOYEE REGISTERED BY COMPANY
  // Jab company employee add karegi tab ye email jayega
  employeeNodeCreated: (employeeName, companyName, dob) => ({
    subject: 'Action Required: Your Professional Profile is Live - HireShield',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #496279; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #eee; }
          .info-box { background: #f4f7f6; border-left: 4px solid #4c8051; padding: 15px; margin: 20px 0; font-size: 14px; }
          .button { display: inline-block; padding: 12px 30px; background: #4c8051; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Identity Node Deployed</h2>
          </div>
          <div class="content">
            <h3>Hello ${employeeName},</h3>
            <p>Your professional profile has been registered on <strong>HireShield</strong> by <strong>${companyName}</strong>.</p>
            <p>You can now access your <strong>Shield Score™</strong> and career integrity ledger using your unique identity node.</p>
            
            <div class="info-box">
              <strong>Your Access Credentials:</strong><br/>
              • First Name: ${employeeName.split(' ')[0]}<br/>
              • Secret Key: Your Date of Birth (${dob})
            </div>

            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/login" class="button">Authenticate Access</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // 3. VERIFY EMAIL
  verifyEmail: (userName, verificationLink) => ({
    subject: 'Verify Your Email - MyHireShield',
    html: ``
  }),

  // 4. RESET PASSWORD
  resetPassword: (userName, resetLink) => ({
    subject: 'Reset Your Password - MyHireShield',
    html: ``
  }),

  // 5. NEW REVIEW NOTIFICATION
  newReview: (employeeName, companyName, score) => ({
    subject: 'New Review Received - MyHireShield',
    html: ``
  })
};