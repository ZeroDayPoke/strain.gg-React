import { useSelector } from "react-redux";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function AppNavbar() {
  const user = useSelector((state) => state.user);
  const isAuthenticated = user && user.roles && user.roles.length > 1;
  const isAdmin = isAuthenticated && user.roles.includes("CLOUD_CHASER");
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Strain.gg
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/strains">
              Strains
            </Nav.Link>
            <Nav.Link as={Link} to="/stores">
              Stores
            </Nav.Link>
            <Nav.Link as={Link} to="/faq">
              FAQ
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/account">
                  Account
                </Nav.Link>
                <Link to="/logout" className="nav-link">
                  Logout
                </Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
