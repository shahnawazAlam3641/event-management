import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/core/Navbar";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";
import EventPage from "./components/pages/EventPage";
import AuthenticatedRoute from "./components/common/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/common/UnauthenticatedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <UnauthenticatedRoute>
              <Home />
            </UnauthenticatedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/event/:id"
          element={
            <AuthenticatedRoute>
              <EventPage />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
