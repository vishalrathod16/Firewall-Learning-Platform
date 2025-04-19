import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const ruleTemplates = {
  "SQL Injection": `function checkSQLInjection(request) {
  const sqlPatterns = [
    "' OR '1'='1",
    "UNION SELECT",
    "; DROP TABLE",
    "1' OR '1'='1"
  ];
  
  return sqlPatterns.some(pattern => 
    pattern.test(request.url) || 
    pattern.test(request.headers['User-Agent'])
  );
}

return checkSQLInjection(request);`,

  XSS: `function checkXSS(request) {
  const xssPatterns = [
    /<script.*?>.*?<\/script>/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i
  ];
  
  return xssPatterns.some(pattern => 
    pattern.test(request.url) || 
    pattern.test(request.headers['User-Agent'])
  );
}

return checkXSS(request);`,

  "Path Traversal": `function checkPathTraversal(request) {
  const traversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /\/etc\/passwd/,
    /\/proc\/self\/environ/
  ];
  
  return traversalPatterns.some(pattern => 
    pattern.test(request.url) || 
    pattern.test(request.headers['User-Agent'])
  );
}

return checkPathTraversal(request);`,
};

const RuleEditor = ({ onSaveRule }) => {
  const [ruleName, setRuleName] = useState("");
  const [ruleCode, setRuleCode] = useState(ruleTemplates["SQL Injection"]);
  const [selectedTemplate, setSelectedTemplate] = useState("SQL Injection");

  const handleTemplateChange = (event) => {
    const template = event.target.value;
    setSelectedTemplate(template);
    setRuleCode(ruleTemplates[template]);
  };

  const handleSave = () => {
    if (!ruleName.trim()) {
      alert("Please enter a rule name");
      return;
    }

    onSaveRule({
      name: ruleName,
      condition: ruleCode,
      action: "block",
    });

    setRuleName("");
    setRuleCode("");
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          WAF Rule Editor
        </Typography>
        <Tooltip title="Rules check incoming requests for malicious patterns. If a pattern matches, the request is blocked.">
          <IconButton>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Rule Template</InputLabel>
        <Select
          value={selectedTemplate}
          label="Rule Template"
          onChange={handleTemplateChange}
        >
          <MenuItem value="SQL Injection">SQL Injection</MenuItem>
          <MenuItem value="XSS">XSS</MenuItem>
          <MenuItem value="Path Traversal">Path Traversal</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <input
          type="text"
          placeholder="Rule Name"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px",
            backgroundColor: "#1e1e1e",
            color: "white",
            border: "1px solid #333",
            borderRadius: "4px",
          }}
        />
      </Box>
      <Box sx={{ height: "300px", mb: 2 }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={ruleCode}
          onChange={(value) => setRuleCode(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Rule
      </Button>
    </Paper>
  );
};

export default RuleEditor;
