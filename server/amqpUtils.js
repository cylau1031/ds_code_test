function start(amqp) {
  return amqp.connect(process.env.CLOUDAMQP_URL)
    .then(conn => {
      conn.on('error', err => {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", () => {
        console.error("[AMQP] reconnecting");
        return setTimeout(start, 1000);
      });
      console.log("[AMQP] connected");
      return conn;
      //whenConnected();
    })
    .catch(err => {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    })
}

module.exports = {
  start
}
