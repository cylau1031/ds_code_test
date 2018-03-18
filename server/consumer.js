'use strict';

const nodemailer = require('nodemailer');

function sendEmail(data, channel) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  let message = JSON.parse(data.content.toString());
  let emailText = Object.keys(message).reduce((acc, cur) => {
    return `${acc}\n${cur.toUpperCase()}: ${message[cur]}`;
  }, '')
  let emailHTML = emailText.replace(/\n/g, '<br />');
  let mailOptions = {
    from: 'Chuen Yan (Jamie) Lau <jlau.test123@gmail.com>',
    to: 'cylau1031@gmail.com',
    subject: 'DS Code Test Email',
    text: `FORM SUBMISSION\n${emailText}`,
    html: `<div><h1>FORM SUBMISSION</h1><br />${emailHTML}</div>`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
        return console.log(error);
    }
    channel.ack(data);
  })
}

function startConsumer(conn) {
  return conn.createChannel()
  .then(channel => {
    channel.on('error', err => {
      console.log('AMQP channel error', err.message);
    })
    channel.on('close', () => console.log('channel closed'))
    channel.prefetch(1);
    return channel.assertQueue('', {durable: true, exclusive: true})
    .then(q => {
      channel.bindQueue(q.queue, 'emails', 'email');
      channel.consume(q.queue, (data) => {
        sendEmail(data, channel);
      }, { noAck: false });
      console.log('WORKER STARTED');
      return q;
    })
  })
  .catch(err => console.log(err))
}

module.exports = startConsumer;
