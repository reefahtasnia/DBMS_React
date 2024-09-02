import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

function generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const otp = generateOTP();


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

function sendEmail(to, subject = 'OTP Code for Maternity Maven') {
  return new Promise((resolve, reject) => {
    const otp = generateOTP();
    var mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: `Dear User, Here is your OTP code: ${otp}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error('Failed to send email:', error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(otp); // Resolve the promise with the otp
      }
    });
  });
}


export { sendEmail };
