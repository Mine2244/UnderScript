onPage('GamesList', function keepAlive() {
  setInterval(() => {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ping: "pong"}));
  }, 10000);
});
