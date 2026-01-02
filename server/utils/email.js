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
  // Welcome email
  welcome: (userName, userRole) => ({
    subject: 'Welcome to MyHireShield! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #EF5350 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to MyHireShield!</h1>
            <p>Empowering Employers. Protecting Futures.</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Thank you for joining MyHireShield as a <strong>${userRole}</strong>.</p>
            
            ${userRole === 'company' ? `
              <h3>What you can do:</h3>
              <ul>
                <li>✅ Search and verify employee backgrounds</li>
                <li>✅ Submit reviews for past employees</li>
                <li>✅ Verify employee documents</li>
                <li>✅ Access comprehensive analytics</li>
              </ul>
            ` : `
              <h3>What you can do:</h3>
              <ul>
                <li>✅ Build your professional reputation</li>
                <li>✅ Upload and verify your documents</li>
                <li>✅ Control your profile visibility</li>
                <li>✅ Track your career progress</li>
              </ul>
            `}
            
            <p>Get started by completing your profile and exploring the platform.</p>
            <a href="${process.env.FRONTEND_URL}" class="button">Go to Dashboard</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 MyHireShield. All rights reserved.</p>
            <p>Empowering Employers. Protecting Futures.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Email verification
  verifyEmail: (userName, verificationLink) => ({
    subject: 'Verify Your Email - MyHireShield',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #EF5350 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Thank you for registering with MyHireShield. Please verify your email address to activate your account.</p>
            
            <a href="${verificationLink}" class="button">Verify Email Address</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="background: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;">${verificationLink}</p>
            
            <div class="warning">
              <strong>⚠️ Security Note:</strong> This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 MyHireShield. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Password reset
  resetPassword: (userName, resetLink) => ({
    subject: 'Reset Your Password - MyHireShield',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #EF5350 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>You requested to reset your password. Click the button below to create a new password.</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="background: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;">${resetLink}</p>
            
            <div class="warning">
              <strong>⚠️ Security Note:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email and your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 MyHireShield. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // New review notification
  newReview: (employeeName, companyName, score) => ({
    subject: 'New Review Received - MyHireShield',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #EF5350 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .score-badge { display: inline-block; padding: 10px 20px; border-radius: 50px; font-weight: bold; font-size: 18px; }
          .score-excellent { background: #22c55e; color: white; }
          .score-average { background: #fbbf24; color: white; }
          .score-poor { background: #ef4444; color: white; }
          .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Review Received! ⭐</h1>
          </div>
          <div class="content">
            <h2>Hello ${employeeName}! 👋</h2>
            <p>You have received a new review from <strong>${companyName}</strong>.</p>
            
            <p>Your updated score:</p>
            <div class="score-badge ${score >= 70 ? 'score-excellent' : score >= 30 ? 'score-average' : 'score-poor'}">
              ${score}/100
            </div>
            
            <p>Login to your dashboard to view the complete review and feedback.</p>
            <a href="${process.env.FRONTEND_URL}/dashboard/employee" class="button">View Review</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 MyHireShield. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Document verified notification
  documentVerified: (employeeName, documentType) => ({
    subject: 'Document Verified - MyHireShield',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #EF5350 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-badge { background: #22c55e; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Document Verified! ✅</h1>
          </div>
          <div class="content">
            <h2>Hello ${employeeName}! 👋</h2>
            <p>Great news! Your <strong>${documentType}</strong> has been successfully verified.</p>
            
            <div class="success-badge">
              ✅ Verified
            </div>
            
            <p>This verification will be visible to potential employers viewing your profile.</p>
            <a href="${process.env.FRONTEND_URL}/dashboard/employee" class="button">View Dashboard</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 MyHireShield. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Document rejected notification
  documentRejected: (employeeName, documentType, reason) => ({
    subject: 'Document Verification Failed - MyHireShield',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #EF5350 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .error-badge { background: #ef4444; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .reason-box { background: #fff; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Document Verification Failed</h1>
          </div>
          <div class="content">
            <h2>Hello ${employeeName}! 👋</h2>
            <p>Unfortunately, your <strong>${documentType}</strong> could not be verified.</p>
            
            <div class="error-badge">
              ❌ Verification Failed
            </div>
            
            <div class="reason-box">
              <strong>Reason:</strong><br>
              ${reason}
            </div>
            
            <p>Please upload a new document or contact support if you believe this is an error.</p>
            <a href="${process.env.FRONTEND_URL}/verification/upload" class="button">Upload New Document</a>
          </div>
          <div class="footer">
            <p>&copy; 2026 MyHireShield. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};