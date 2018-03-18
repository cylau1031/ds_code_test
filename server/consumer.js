'use strict';

const nodemailer = require('nodemailer');

function sendEmail(data, channel) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS
    }
  });
  let message = JSON.parse(data.content.toString());
  let emailText = Object.keys(message).reduce((acc, cur) => {
    return `${acc}\n${cur}: ${message[cur]}`;
  }, '')
  let emailHTML = emailText.replace(/\n/g, '<br />');
  let mailOptions = {
    from: 'Jamie <jlau.test123@gmail.com>',
    to: 'cylau1031@gmail.com',
    subject: 'Email testing',
    text: `FORM SUBMISSION\n${emailText}`,
    html: `<div><h1>FORM SUBMISSION</h1><br />${emailHTML}</div>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
  channel.ack(data);
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
