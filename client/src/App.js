import React from "react";
import { ThemeProvider } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { darkTheme } from "./theme";
import LearningPage from "./components/LearningPage";
import Simulator from "./components/Simulator";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<LearningPage />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
