import { Container } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";

import { NavBar, Routes } from "./components/DefaultComponents";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <NavBar />
      <Container className="mt-3" style={{ width: "90vw" }}>
        <Routes />
      </Container>
    </Router>
  );
}

export default App;
