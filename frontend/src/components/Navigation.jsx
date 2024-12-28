import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/custom.css'; // Import custom CSS

const Navigation = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Get the logged-in user from localStorage

  return (
    <Navbar className="navbar-custom" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white">
          My Colorful App
        </Navbar.Brand>
        <Nav className="ml-auto">
          {user ? (
            <>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link onClick={() => {
                localStorage.removeItem('user');
                window.location.reload();
              }}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
