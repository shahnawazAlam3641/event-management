import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/core/Navbar";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";
import EventDetails from "./components/pages/EventDetails";
import EventPage from "./components/pages/EventPage";
import AuthenticatedRoute from "./components/common/AuthenticatedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
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
