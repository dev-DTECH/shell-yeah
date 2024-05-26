module.exports = {
    apps : [{
      name      : "tank-br-server",
      script    : "server.js", // Replace with your main server file
      instances  : "1", // Start with 2 worker processes
      exec_mode : "cluster",
      autorestart: true
    }]
  };