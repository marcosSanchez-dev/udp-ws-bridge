// server.js
const dgram = require("dgram");
const WebSocket = require("ws");

// 1. Receptor UDP
const udpPort = 4210;
const udpServer = dgram.createSocket("udp4");

udpServer.on("message", (msg, rinfo) => {
  console.log(
    `📨 Mensaje UDP recibido: ${msg.toString()} de ${rinfo.address}:${
      rinfo.port
    }`
  );

  // Reenvía por WebSocket a todos los clientes conectados
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg.toString());
    }
  });
});

udpServer.bind(udpPort, () => {
  console.log(`✅ Servidor UDP escuchando en puerto ${udpPort}`);
});

// 2. Servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("🧠 Cliente WebSocket conectado");
});

console.log("🌐 Servidor WebSocket en puerto 8080 listo");
