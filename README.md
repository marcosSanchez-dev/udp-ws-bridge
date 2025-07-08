# 🛰️ udp-ws-bridge

**Bridge en tiempo real entre dispositivos UDP (como ESP32) y clientes WebSocket en la web.**  
Este proyecto permite recibir mensajes UDP desde hardware embebido (como un ESP32 vía Ethernet) y retransmitirlos a través de WebSockets a cualquier cliente conectado (por ejemplo, una app web en React).

---

## ⚙️ ¿Cómo funciona?

Este proyecto tiene dos partes:

1. **Servidor Node.js (server.js)**  
   - Escucha mensajes entrantes por **UDP** (puerto `4210`)
   - Retransmite esos mensajes a todos los clientes conectados por **WebSocket** (puerto `8080`)

2. **ESP32 WT32-ETH01 (Arduino)**  
   - Envía mensajes UDP cada 2 segundos a la IP del servidor

---

## 🖥️ Estructura

udp-ws-bridge/
├── server.js # Servidor UDP + WebSocket en Node.js
├── arduino/ # Código fuente Arduino para ESP32 WT32-ETH01
│ └── udp_sender.ino
├── README.md
├── package.json
└── .gitignore


---

## 🚀 Requisitos

### Servidor
- Node.js v16+
- Red local donde ESP32 y PC estén conectados

### Dispositivo
- ESP32 WT32-ETH01 (con conexión Ethernet)
- Arduino IDE configurado

---

## 📡 Código del Servidor (Node.js)

```js
// server.js
const dgram = require("dgram");
const WebSocket = require("ws");

const udpPort = 4210;
const udpServer = dgram.createSocket("udp4");

udpServer.on("message", (msg, rinfo) => {
  console.log(`📨 Mensaje UDP recibido: ${msg.toString()}`);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg.toString());
    }
  });
});

udpServer.bind(udpPort, () => {
  console.log(`✅ Servidor UDP escuchando en puerto ${udpPort}`);
});

const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", () => console.log("🧠 Cliente WebSocket conectado"));
```

🤖 Código Arduino (ESP32 WT32-ETH01)
```c++
#include <ETH.h>
#include <WiFiUdp.h>

WiFiUDP udp;
IPAddress serverIp(192, 168, 68, 101);  // IP del servidor Node.js
const int udpPort = 4210;

IPAddress localIP(192, 168, 68, 200);   // IP fija para ESP32
IPAddress gateway(192, 168, 68, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress dns(8, 8, 8, 8);

void setup() {
  Serial.begin(115200);
  ETH.begin();
  ETH.config(localIP, gateway, subnet, dns);

  while (ETH.localIP() == IPAddress(0, 0, 0, 0)) {
    delay(500);
    Serial.println("Esperando IP...");
  }

  Serial.print("✅ IP fija asignada: ");
  Serial.println(ETH.localIP());
}

void loop() {
  const char* message = "PLAYER1";
  udp.beginPacket(serverIp, udpPort);
  udp.write((const uint8_t*)message, strlen(message));
  udp.endPacket();
  delay(2000);
}
```


🌐 Uso Típico
1- Conecta tu ESP32 por Ethernet

2- Ejecuta el servidor Node.js:


node server.js
Tu frontend web (o consola WebSocket) recibirá los mensajes desde el ESP32

Instalación

npm install
node server.js

