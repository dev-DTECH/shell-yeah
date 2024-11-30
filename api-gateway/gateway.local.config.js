module.exports = {
  "rateLimit": 10000,
  "timeout": 10000,
  "services": [
    {
      "name": "game-ws",
      "route": "/game-ws",
      "target": "ws://localhost:3100/socket.io"
    },
    {
      "name": "ui",
      "route": "/",
      "target": "http://localhost:5173",
      "authorize": false
    },
  ]
}