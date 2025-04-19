const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

// In-memory storage for rules and logs
let rules = [];
let logs = [];

// Attack patterns for different types of attacks
const attackPatterns = {
  "SQL Injection": [
    "/api/search?q=' OR '1'='1",
    "/api/login?username=admin'--",
    "/api/products?id=1; DROP TABLE users",
    "/api/user?id=1 UNION SELECT * FROM users",
  ],
  XSS: [
    "/api/comment?text=<script>alert(1)</script>",
    "/api/search?q=<img src=x onerror=alert(1)>",
    "/api/profile?name=javascript:alert(1)",
    "/api/feedback?message=<svg onload=alert(1)>",
  ],
  "Path Traversal": [
    "/api/files?path=../../../etc/passwd",
    "/api/download?file=..\\..\\windows\\system.ini",
    "/api/logs?file=/proc/self/environ",
    "/api/config?path=../../config.json",
  ],
  "Command Injection": [
    "/api/ping?host=127.0.0.1; cat /etc/passwd",
    "/api/exec?cmd=ls -la /",
    "/api/system?command=whoami",
    "/api/run?script=rm -rf /",
  ],
};

// API endpoints
app.get("/api/rules", (req, res) => {
  res.json(rules);
});

app.post("/api/rules", (req, res) => {
  const newRule = {
    id: Date.now(),
    ...req.body,
  };
  rules.push(newRule);
  res.json(newRule);
});

app.get("/api/logs", (req, res) => {
  res.json(logs);
});

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("startSimulation", () => {
    // Start generating simulated attacks
    const attackTypes = Object.keys(attackPatterns);
    const interval = setInterval(() => {
      const attackType =
        attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const patterns = attackPatterns[attackType];
      const attackUrl = patterns[Math.floor(Math.random() * patterns.length)];

      const request = {
        type: attackType,
        url: attackUrl,
        timestamp: new Date(),
      };

      // Check rules against the request
      const results = rules.map((rule) => {
        const matches = rule.patterns.some(
          (pattern) =>
            request.url.includes(pattern) ||
            request.type.toLowerCase().includes(pattern.toLowerCase())
        );
        return {
          ruleName: rule.name,
          action: matches ? "block" : "allow",
        };
      });

      const logEntry = {
        request,
        results,
        timestamp: new Date(),
      };

      logs.push(logEntry);
      socket.emit("simulationUpdate", logEntry);
    }, 2000);

    socket.on("stopSimulation", () => {
      clearInterval(interval);
      socket.emit("simulationStopped");
    });

    socket.on("disconnect", () => {
      clearInterval(interval);
    });
  });

  // Add handler for single attack
  socket.on("singleAttack", (data) => {
    const attackType = data.type;
    const patterns = attackPatterns[attackType];

    if (!patterns) {
      console.error(`Unknown attack type: ${attackType}`);
      return;
    }

    // Select a random pattern for the attack type
    const attackUrl = patterns[Math.floor(Math.random() * patterns.length)];

    const request = {
      type: attackType,
      url: attackUrl,
      timestamp: new Date(),
    };

    // Check rules against the request
    const results = rules.map((rule) => {
      const matches = rule.patterns.some(
        (pattern) =>
          request.url.includes(pattern) ||
          request.type.toLowerCase().includes(pattern.toLowerCase())
      );
      return {
        ruleName: rule.name,
        action: matches ? "block" : "allow",
      };
    });

    const logEntry = {
      request,
      results,
      timestamp: new Date(),
    };

    logs.push(logEntry);
    socket.emit("simulationUpdate", logEntry);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
