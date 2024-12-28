import React, { useState } from 'react';
import { Button, Form, Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Send signup request to backend
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role,
      });

      // Show success message and redirect to login page
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error);
      alert(error.response ? error.response.data.message : 'Error during signup');
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg rounded-lg border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4" style={{ fontWeight: '600', color: '#333' }}>Sign Up</h2>
              <Form onSubmit={handleSignup}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control-lg"
                    style={{ borderRadius: '0.375rem', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
                    required
                  />
                </Form.Group>

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

                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control-lg"
                    style={{ borderRadius: '0.375rem', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span className="text-muted">Already have an account? </span>
                <Button variant="link" onClick={() => navigate('/login')} className="text-muted" style={{ fontWeight: '600' }}>
                  Login
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
