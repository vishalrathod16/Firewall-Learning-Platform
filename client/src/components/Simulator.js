import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import io from "socket.io-client";
import RuleEditor from "./RuleEditor";

const socket = io("http://localhost:5000");

const Simulator = () => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [results, setResults] = useState([]);
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch existing rules
    fetch("http://localhost:5000/api/rules")
      .then((res) => res.json())
      .then((data) => setRules(data));

    // Fetch logs
    fetch("http://localhost:5000/api/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data));

    socket.on("simulationUpdate", (data) => {
      setCurrentRequest(data.request);
      setResults(data.results);
      setLogs((prevLogs) => [...prevLogs, data]);
    });

    socket.on("simulationStopped", () => {
      setSimulationActive(false);
    });

    return () => {
      socket.off("simulationUpdate");
      socket.off("simulationStopped");
    };
  }, []);

  const handleStartSimulation = () => {
    setSimulationActive(true);
    socket.emit("startSimulation");
  };

  const handleStopSimulation = () => {
    setSimulationActive(false);
    socket.emit("stopSimulation");
  };

  const handleSaveRule = async (rule) => {
    try {
      const response = await fetch("http://localhost:5000/api/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rule),
      });
      const newRule = await response.json();
      setRules((prevRules) => [...prevRules, newRule]);
    } catch (error) {
      console.error("Error saving rule:", error);
    }
  };

  const getAttackTypeColor = (type) => {
    switch (type) {
      case "SQL Injection":
        return "error.main";
      case "XSS":
        return "warning.main";
      case "Path Traversal":
        return "info.main";
      case "Command Injection":
        return "secondary.main";
      default:
        return "text.primary";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            FireSim: WAF Simulator
          </Typography>
          <Typography variant="body1" gutterBottom>
            Interactive Web Application Firewall Testing Environment
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RuleEditor onSaveRule={handleSaveRule} />

            {/* Saved Rules Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Saved Rules
              </Typography>
              {rules.length === 0 ? (
                <Typography color="text.secondary">
                  No rules saved yet. Create a rule above.
                </Typography>
              ) : (
                rules.map((rule, index) => (
                  <Box key={rule.id || index} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1">{rule.name}</Typography>
                      <Chip
                        label={rule.action}
                        color={rule.action === "block" ? "error" : "success"}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {rule.patterns.map((pattern, i) => (
                        <Chip
                          key={i}
                          label={pattern}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    {index < rules.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))
              )}
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartSimulation}
                  disabled={simulationActive}
                  sx={{ mr: 2 }}
                >
                  Start Simulation
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleStopSimulation}
                  disabled={!simulationActive}
                >
                  Stop Simulation
                </Button>
              </Box>

              {currentRequest && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Current Request
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
                    <Typography
                      variant="body1"
                      sx={{ color: getAttackTypeColor(currentRequest.type) }}
                    >
                      Type: {currentRequest.type}
                    </Typography>
                    <Typography variant="body1">
                      URL: {currentRequest.url}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {results.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    WAF Results
                  </Typography>
                  {results.map((result, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        mb: 1,
                        bgcolor:
                          result.action === "block"
                            ? "error.dark"
                            : "success.dark",
                      }}
                    >
                      <Typography variant="body1">
                        Rule: {result.ruleName}
                      </Typography>
                      <Typography variant="body1">
                        Action: {result.action}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{ p: 3, height: "calc(100vh - 200px)", overflow: "auto" }}
            >
              <Typography variant="h6" gutterBottom>
                Request Logs
              </Typography>
              {logs.map((log, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 1,
                    bgcolor: log.results.some((r) => r.action === "block")
                      ? "error.dark"
                      : "success.dark",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: getAttackTypeColor(log.request.type) }}
                  >
                    Type: {log.request.type}
                  </Typography>
                  <Typography variant="body1">
                    URL: {log.request.url}
                  </Typography>
                  <Typography variant="body1">
                    Status:{" "}
                    {log.results.some((r) => r.action === "block")
                      ? "Blocked"
                      : "Allowed"}
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Simulator;
