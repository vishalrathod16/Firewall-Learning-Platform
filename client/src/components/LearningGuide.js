import React from "react";
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LearningGuide = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        WAF Learning Guide
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>What is a WAF?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            A Web Application Firewall (WAF) protects web applications by
            filtering and monitoring HTTP traffic. It helps prevent attacks like
            SQL Injection, XSS, and other common web vulnerabilities.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Common Attack Types</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="error">
              SQL Injection
            </Typography>
            <Typography>
              Attempts to manipulate database queries through user input.
              Example: ' OR '1'='1
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="error">
              XSS (Cross-Site Scripting)
            </Typography>
            <Typography>
              Injects malicious scripts into web pages. Example:
              &lt;script&gt;alert(1)&lt;/script&gt;
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="error">
              Path Traversal
            </Typography>
            <Typography>
              Attempts to access files outside the web root directory. Example:
              ../../../etc/passwd
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>How Rules Work</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            WAF rules check incoming requests for malicious patterns. If a
            pattern matches, the request is blocked. Rules can check URLs,
            headers, and request bodies.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default LearningGuide;
