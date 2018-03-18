function startConsumer(conn) {
  conn.createChannel()
  .then(channel => {
    channel.prefetch(1);
    channel.assertQueue('emails', { durable: true })
    .then(() => {
      channel.consume('emails', (data) => {
        console.log(data)
        channel.ack(data);
      }, { noAck: false });
      console.log('WORKER STARTED');
    })
  })
  .catch(err => console.log(err))
}

module.exports = startConsumer;
