import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css'; // Import custom CSS

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/login');
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="card-custom">
            <Card.Body className="bg-primary text-white text-center">
              <h3>Welcome, {user.email}</h3>
              <h5>Role: {user.role}</h5>
              <p className="mt-3">
                You are logged in as {user.role}. Access the relevant content below:
              </p>
              {user.role === 'faculty' && (
                <Button variant="light" onClick={() => alert('Faculty Content')} className="btn-custom">
                  Faculty Dashboard
                </Button>
              )}
              {user.role === 'student' && (
                <Button variant="light" onClick={() => alert('Student Content')} className="btn-custom">
                  Student Dashboard
                </Button>
              )}
              {user.role === 'hod' && (
                <Button variant="light" onClick={() => alert('HOD Content')} className="btn-custom">
                  HOD Dashboard
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
