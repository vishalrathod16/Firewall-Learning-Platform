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
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://firesim-client.onrender.com",
            "https://firesim.onrender.com",
          ]
        : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://firesim-client.onrender.com",
            "https://firesim.onrender.com",
          ]
        : "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

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
  // If no rules exist, allow the request
  if (rules.length === 0) {
    return [
      {
        ruleName: "No Rules Defined",
        matches: false,
        action: "allow",
        message:
          "No WAF rules are currently defined to protect against this attack.",
      },
    ];
  }

  // Find the first matching rule
  for (const rule of rules) {
    try {
      // Create the function from the rule's condition
      const ruleFunction = new Function("request", rule.condition);
      const matches = ruleFunction(request);

      if (matches) {
        // Return only the matching rule
        return [
          {
            ruleId: rule.id,
            ruleName: rule.name,
            matches: true,
            action: "block",
          },
        ];
      }
    } catch (error) {
      console.error("Error evaluating rule:", error);
      return [
        {
          ruleId: rule.id,
          ruleName: rule.name,
          error: error.message,
          action: "allow",
        },
      ];
    }
  }

  // If no rules matched, return message
  return [
    {
      ruleName: "No Rule Matched",
      matches: false,
      action: "allow",
      message: "No rule matched this attack pattern. The attack was allowed.",
    },
  ];
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
