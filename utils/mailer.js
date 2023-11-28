//nodemailer dgn GMAIL ceunikejeannyfer

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{ 
        user: 'ceunikejeannyfer@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
})

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: 'ceunikejeannyfer@gmail.com',
    to,
    subject,
    text
  }

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
   console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  });
}

const sendMailHTML = (to, subject, html) => {
  const mailOptions = {
      from: 'ceunikejeannyfer@gmail.com',
      to,
      subject,
      html
  } 
  transporter.sendMail(mailOptions, (err, info) => {
      if(err){
          console.log(error)
      }else{
          console.log('Email sent: ' + info.response)
      }
  })
}

module.exports = {sendMail, sendMailHTML}