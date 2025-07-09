// server.js
const dgram = require("dgram");
const WebSocket = require("ws");

// 1. Receptor UDP
const udpPort = 4210;
const udpServer = dgram.createSocket("udp4");

udpServer.on("message", (msg, rinfo) => {
  const mensaje = msg.toString().trim();
  console.log(
    `📨 UDP recibido: "${mensaje}" de ${rinfo.address}:${rinfo.port}`
  );

  // Reenvía a cada cliente WebSocket conectado
  let count = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(mensaje);
      count++;
    }
  });

  console.log(`📤 Reenviado por WebSocket a ${count} cliente(s)\n`);
});

// Agrega esto en server.js ANTES de udpServer.bind
udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`🔊 Escuchando en ${address.address}:${address.port}`);
});

udpServer.on("error", (err) => {
  console.error(`❌ Error UDP: ${err.stack}`);
});

udpServer.bind(udpPort, () => {
  console.log(`✅ Servidor UDP escuchando en puerto ${udpPort}`);
});

// 2. Servidor WebSocket
const wss = new WebSocket.Server({ port: 8080 });
wss.on("error", (error) => {
  console.error("❌ Error en servidor WebSocket:", error);
});

wss.on("connection", (ws) => {
  console.log("🧠 Cliente WebSocket conectado");
});

console.log("🌐 Servidor WebSocket en puerto 8080 listo");
