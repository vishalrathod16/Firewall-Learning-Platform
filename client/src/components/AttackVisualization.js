import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AttackVisualization = ({ logs }) => {
  // Process logs for visualization
  const attackStats = logs.reduce((acc, log) => {
    const type = log.request.type;
    if (!acc[type]) {
      acc[type] = { count: 0, blocked: 0 };
    }
    acc[type].count++;
    if (log.results.some((r) => r.action === "block")) {
      acc[type].blocked++;
    }
    return acc;
  }, {});

  const chartData = Object.entries(attackStats).map(([type, stats]) => ({
    name: type,
    total: stats.count,
    blocked: stats.blocked,
    allowed: stats.count - stats.blocked,
  }));

  const pieData = [
    {
      name: "Blocked",
      value: logs.filter((log) => log.results.some((r) => r.action === "block"))
        .length,
    },
    {
      name: "Allowed",
      value: logs.filter(
        (log) => !log.results.some((r) => r.action === "block")
      ).length,
    },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Attack Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Attacks by Type
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="blocked" name="Blocked" fill="#ff4444" />
              <Bar dataKey="allowed" name="Allowed" fill="#00C851" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Overall Block/Allow Ratio
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#ff4444" : "#00C851"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AttackVisualization;
