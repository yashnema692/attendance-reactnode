import React, { useState } from 'react';
import { Button, Form, Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      // Get the response token and role
      const { token, role: userRole } = response.data;

      // Store the token, role, and email in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('email', email); // Store email in localStorage

      // Redirect based on the role
      if (userRole === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (userRole === 'student') {
        navigate('/student-dashboard');
      } else if (userRole === 'hod') {
        navigate('/hod-dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials or role mismatch');
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg rounded-lg border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4" style={{ fontWeight: '600', color: '#333' }}>Login</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control-lg"
                    style={{ borderRadius: '0.375rem', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control-lg"
                    style={{ borderRadius: '0.375rem', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formRole" className="mb-3">
                  <Form.Label>Select Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-control-lg"
                    style={{ borderRadius: '0.375rem', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="faculty">Faculty</option>
                    <option value="student">Student</option>
                    <option value="hod">HOD</option>
                  </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 btn-lg mt-3" style={{ borderRadius: '0.375rem' }}>
                  Login
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span className="text-muted">Don't have an account? </span>
                <Button variant="link" onClick={() => navigate('/signup')} className="text-muted" style={{ fontWeight: '600' }}>
                  Sign Up
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
