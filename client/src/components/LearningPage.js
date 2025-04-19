import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const LearningPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to FireSim
        </Typography>
        <Typography variant="body1" paragraph>
          An interactive learning platform for understanding Web Application
          Firewalls (WAFs) and testing security rules.
        </Typography>
      </Paper>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            What is a Web Application Firewall?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            A Web Application Firewall (WAF) is a security solution that
            protects web applications by monitoring and filtering HTTP traffic
            between a web application and the Internet. It helps prevent attacks
            like SQL injection, cross-site scripting (XSS), and other common web
            vulnerabilities.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Understanding Common Web Attacks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="SQL Injection"
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      SQL Injection occurs when an attacker inserts malicious
                      SQL statements into input fields. To block SQL Injection
                      attacks, add these patterns to your rules:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="' OR '1'='1" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="UNION SELECT" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="DROP TABLE" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="--" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary=";" />
                      </ListItem>
                    </List>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Cross-Site Scripting (XSS)"
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      XSS attacks inject malicious scripts into web pages. To
                      block XSS attacks, add these patterns:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="<script>" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="javascript:" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="onerror=" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="onload=" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="alert(" />
                      </ListItem>
                    </List>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Path Traversal"
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Path Traversal attacks attempt to access files outside the
                      web root directory. To block these attacks, add these
                      patterns:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="../" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="..\\" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="/etc/passwd" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="C:\\" />
                      </ListItem>
                    </List>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Command Injection"
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Command Injection attacks attempt to execute system
                      commands. To block these attacks, add these patterns:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary=";" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="|" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="`" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="cat /etc/passwd" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="whoami" />
                      </ListItem>
                    </List>
                  </Box>
                }
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">How to Use the Simulator</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            The FireSim platform provides an interactive environment to test WAF
            rules against various attacks. Here's how to use it:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="1. Create WAF Rules"
                secondary="Use the Rule Editor to create rules with patterns that match the attack types you want to block. Give your rule a descriptive name and add the relevant patterns."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Test Individual Attacks"
                secondary="Use the 'Perform Single Attack' buttons to test specific attack types against your rules. Each button will generate a single attack of that type."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Run Continuous Simulation"
                secondary="Use the 'Start Continuous Simulation' button to generate random attacks of all types. This helps test your rules against a variety of attacks."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Monitor Results"
                secondary="Watch the logs to see which attacks were blocked or allowed by your rules. The logs show the attack type, URL, and whether it was blocked or allowed."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Best Practices for WAF Rules</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemText
                primary="Be Specific"
                secondary="Create separate rules for different attack types to make it easier to manage and update them."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Test Thoroughly"
                secondary="Test your rules with both the single attack buttons and continuous simulation to ensure they catch all variations of attacks."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Monitor False Positives"
                secondary="Watch for legitimate requests that might be blocked by your rules and adjust the patterns accordingly."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Keep Rules Updated"
                secondary="Regularly update your rules with new attack patterns as new vulnerabilities are discovered."
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/simulator")}
          sx={{ px: 4, py: 2 }}
        >
          Go to Simulator
        </Button>
      </Box>
    </Container>
  );
};

export default LearningPage;
