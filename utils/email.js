const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options

  const mailOptions = {
    from: 'Rohit Gupta <rohit@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    //html
  };
  // console.log('transporter', mailOptions);

  // 3) Actually send the email
  // try {
  await transporter.sendMail(mailOptions);
  // } catch (error) {
  //   console.log('error', error);
  // }
};

module.exports = sendEmail;
