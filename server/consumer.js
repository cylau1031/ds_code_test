'use strict';

const nodemailer = require('nodemailer');

function sendEmail(data, channel) {
  nodemailer.createTestAccount((err, account) => {
    if (err) return err;
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
          user: account.user,
          pass: account.pass
      }
    })
    let message = JSON.parse(data.content.toString());
    let emailText = Object.keys(message).reduce((acc, cur, ind) => {
      return `${acc}\n${cur}: ${message[cur]}`;
    }, '')
    let emailHTML = emailText.replace(/\n/g, '<br />');
    let mailOptions = {
      from: 'Jamie <test@test.com>',
      to: 'test@test.com',
      subject: 'Email testing',
      text: `${emailText}`,
      html: `<div>${emailHTML}</div>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      // Preview email with Ethereal email with link below
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      channel.ack(data);
    })
  })

}

function startConsumer(conn) {
  conn.createChannel()
  .then(channel => {
    channel.prefetch(1);
    channel.assertQueue('', {durable: true, exclusive: true})
    .then(queue => {
      channel.bindQueue(queue.queue, 'emails', 'email');
      channel.consume(queue.queue, (data) => {
        sendEmail(data, channel);
      }, { noAck: false });
      console.log('WORKER STARTED');
    })
  })
  .catch(err => console.log(err))
}

module.exports = startConsumer;
