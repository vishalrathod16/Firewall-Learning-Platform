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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to FireSim
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Learn about Web Application Firewalls and Test Your Rules
        </Typography>
        <Typography variant="body1" paragraph>
          FireSim is an interactive platform designed to help you understand and
          test Web Application Firewall (WAF) rules. Learn about common web
          attacks and how WAFs protect against them.
        </Typography>
      </Paper>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            What is a Web Application Firewall?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            A Web Application Firewall (WAF) is a security solution that
            protects web applications by filtering and monitoring HTTP traffic
            between a web application and the Internet.
          </Typography>
          <Typography paragraph>
            WAFs help protect web applications from attacks such as:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="SQL Injection"
                secondary="Malicious SQL queries injected into input fields"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Cross-Site Scripting (XSS)"
                secondary="Injecting malicious scripts into web pages"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Path Traversal"
                secondary="Accessing files outside the web root directory"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Command Injection"
                secondary="Executing arbitrary commands on the server"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">How WAF Rules Work</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            WAF rules are sets of conditions that determine whether a request
            should be allowed or blocked. Each rule consists of:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Rule Name"
                secondary="A descriptive name for the rule"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Condition"
                secondary="The pattern or condition to match against requests"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Action"
                secondary="What to do when the condition is met (block or allow)"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Using FireSim</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            FireSim provides a safe environment to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Create WAF Rules"
                secondary="Define your own rules to protect against attacks"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Test Rules"
                secondary="See how your rules perform against simulated attacks"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="View Logs"
                secondary="Monitor and analyze attack attempts and rule matches"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/simulator")}
          sx={{ px: 4, py: 2 }}
        >
          Start Simulator
        </Button>
      </Box>
    </Container>
  );
};

export default LearningPage;
