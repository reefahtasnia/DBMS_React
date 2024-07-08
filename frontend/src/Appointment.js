import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import doctorImage from './css/assets/doctor.jpg'; 

function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors');
      const data = await response.json();
      setDoctors(data);
      setResultCount(data.length); // Update result count
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctors?search=${search}`);
      const data = await response.json();
      setDoctors(data);
      setResultCount(data.length); // Update result count
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  return (
    <Container>
      <h1 className='text-center mt-4'>Doctors</h1>
      <Form className="mb-4">
        <Row>
          <Col md={10}>
            <Form.Control 
              type="text" 
              placeholder="Search by name, department, or location" 
              value={search}
              onChange={(e) => setSearch(e.target.value)} 
            />
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      <h4 className='text-center'>Search Result ({resultCount})</h4> {/* Display result count */}
      <Row>
        {doctors.map((doctor, index) => (
          <Col md={6} key={index} className="mb-4">
            <Card>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <img
                      src={doctorImage}
                      alt="Doctor"
                      className="img-fluid rounded-circle"
                    />
                  </Col>
                  <Col md={9}>
                    <Card.Title>{doctor[0]}</Card.Title>
                    <Card.Text>
                      <strong>Department:</strong> {doctor[1]}<br />
                      <strong>Location:</strong> {doctor[2]}<br />
                      <strong>Experience:</strong> {doctor[3]} years<br /> {/* Display experience */}
                      {/* Additional fields can be added here */}
                    </Card.Text>
                    <Button variant="primary">Book Appointment</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Appointment;
