const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(cors());
app.use(bodyParser.json());

// Store WAF rules and logs
let wafRules = [];
let logs = [];

// Attack patterns for simulation
const attackPatterns = [
  {
    type: "SQL Injection",
    patterns: [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "UNION SELECT * FROM users",
      "1' OR '1'='1",
    ],
  },
  {
    type: "XSS",
    patterns: [
      "<script>alert(1)</script>",
      "<img src=x onerror=alert(1)>",
      "javascript:alert(1)",
    ],
  },
  {
    type: "Path Traversal",
    patterns: [
      "../../../etc/passwd",
      "..\\..\\..\\windows\\system32\\config",
      "/etc/passwd",
    ],
  },
  {
    type: "Command Injection",
    patterns: ["; ls -la", "| cat /etc/passwd", "`whoami`"],
  },
];

// WAF rule evaluation function
function evaluateRequest(request, rules) {
  const results = [];
  let shouldBlock = false;

  // If no rules exist, allow the request
  if (rules.length === 0) {
    results.push({
      ruleName: "Default",
      matches: false,
      action: "allow",
    });
    return results;
  }

  for (const rule of rules) {
    try {
      // Create the function from the rule's condition
      const ruleFunction = new Function("request", rule.condition);
      const matches = ruleFunction(request);

      if (matches) {
        // If rule matches, block the request
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          matches: true,
          action: "block",
        });
        shouldBlock = true;
        break; // Stop checking other rules if we found a match
      }
    } catch (error) {
      console.error("Error evaluating rule:", error);
      results.push({
        ruleId: rule.id,
        ruleName: rule.name,
        error: error.message,
        action: "allow", // On error, allow the request
      });
    }
  }

  // If no rules matched or no blocking occurred, allow the request
  if (!shouldBlock) {
    results.push({
      ruleName: "Default",
      matches: false,
      action: "allow",
    });
  }

  return results;
}

// Generate random attack request
function generateAttackRequest() {
  const attackType =
    attackPatterns[Math.floor(Math.random() * attackPatterns.length)];
  const pattern =
    attackType.patterns[Math.floor(Math.random() * attackType.patterns.length)];

  return {
    timestamp: new Date().toISOString(),
    type: attackType.type,
    url: `/api/v1/users?q=${encodeURIComponent(pattern)}`,
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
  };
}

// API endpoints
app.post("/api/rules", (req, res) => {
  const newRule = {
    id: Date.now(),
    name: req.body.name,
    condition: req.body.condition,
    action: "block", // Force action to be "block" for all rules
  };
  wafRules.push(newRule);
  res.json(newRule);
});

app.get("/api/rules", (req, res) => {
  res.json(wafRules);
});

app.delete("/api/rules/:id", (req, res) => {
  wafRules = wafRules.filter((rule) => rule.id !== parseInt(req.params.id));
  res.json({ success: true });
});

app.get("/api/logs", (req, res) => {
  res.json(logs);
});

// Store active intervals
const activeIntervals = new Map();

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  // Start simulation
  socket.on("startSimulation", () => {
    const intervalId = setInterval(() => {
      const request = generateAttackRequest();
      const results = evaluateRequest(request, wafRules);

      // Log the request and results
      const logEntry = {
        timestamp: new Date().toISOString(),
        request,
        results,
      };
      logs.push(logEntry);

      // Emit to all connected clients
      io.emit("simulationUpdate", logEntry);
    }, 3000);

    activeIntervals.set(socket.id, intervalId);
  });

  socket.on("stopSimulation", () => {
    const intervalId = activeIntervals.get(socket.id);
    if (intervalId) {
      clearInterval(intervalId);
      activeIntervals.delete(socket.id);
    }
    socket.emit("simulationStopped");
  });

  socket.on("disconnect", () => {
    const intervalId = activeIntervals.get(socket.id);
    if (intervalId) {
      clearInterval(intervalId);
      activeIntervals.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
