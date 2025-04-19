import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

const RuleEditor = ({ onSaveRule }) => {
  const [ruleName, setRuleName] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [currentPattern, setCurrentPattern] = useState("");
  const [action, setAction] = useState("block");

  const handleAddPattern = () => {
    if (currentPattern.trim() && !patterns.includes(currentPattern.trim())) {
      setPatterns([...patterns, currentPattern.trim()]);
      setCurrentPattern("");
    }
  };

  const handleRemovePattern = (patternToRemove) => {
    setPatterns(patterns.filter((pattern) => pattern !== patternToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ruleName.trim() && patterns.length > 0) {
      onSaveRule({
        name: ruleName.trim(),
        patterns,
        action,
      });
      setRuleName("");
      setPatterns([]);
      setAction("block");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create WAF Rule
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Rule Name"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          margin="normal"
          required
        />

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Add Pattern"
            value={currentPattern}
            onChange={(e) => setCurrentPattern(e.target.value)}
            margin="normal"
            helperText="Enter patterns to match (e.g., 'sql', 'script', '../')"
          />
          <Button
            variant="outlined"
            onClick={handleAddPattern}
            sx={{ mt: 1 }}
            disabled={!currentPattern.trim()}
          >
            Add Pattern
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {patterns.map((pattern) => (
            <Chip
              key={pattern}
              label={pattern}
              onDelete={() => handleRemovePattern(pattern)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>

        <FormControl fullWidth margin="normal">
          <InputLabel>Action</InputLabel>
          <Select
            value={action}
            label="Action"
            onChange={(e) => setAction(e.target.value)}
          >
            <MenuItem value="block">Block</MenuItem>
            <MenuItem value="allow">Allow</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!ruleName.trim() || patterns.length === 0}
        >
          Save Rule
        </Button>
      </Box>
    </Paper>
  );
};

export default RuleEditor;
