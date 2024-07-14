CREATE TABLE Doctor (
    name VARCHAR(255),
    department VARCHAR(255),
    location VARCHAR(255),
    experience INT
);
INSERT INTO Doctor (name, department, location, experience) VALUES
('Dr. John Doe', 'Cardiology', 'Dhaka', 30),
('Dr. Jane Smith', 'Neurology', 'Khulna', 25),
('Dr. Alice Johnson', 'Pediatrics', 'Chittagong', 20),
('Dr. Robert Brown', 'Orthopedics', 'Sylhet', 15),
('Dr. Emily Davis', 'Gynecology', 'Mymensingh', 10),
('Dr. Michael Adams', 'Dermatology', 'Dhaka', 35),
('Dr. Sara Lee', 'Cardiology', 'Khulna', 8),
('Dr. David Kim', 'Neurology', 'Chittagong', 5),
('Dr. Jennifer White', 'Pediatrics', 'Sylhet', 12),
('Dr. Thomas Clark', 'Orthopedics', 'Mymensingh', 7),
('Dr. Olivia Harris', 'Gynecology', 'Dhaka', 9),
('Dr. James Wilson', 'Dermatology', 'Khulna', 18),
('Dr. Emily Martinez', 'Cardiology', 'Chittagong', 22),
('Dr. Daniel Rodriguez', 'Neurology', 'Sylhet', 16),
('Dr. Sophia Thompson', 'Pediatrics', 'Mymensingh', 14);


COMMIT;

CREATE TABLE medical_history (
    year INT,
    incident VARCHAR(255),
    treatment VARCHAR(255)
);

INSERT INTO medical_history (year, incident, treatment) VALUES
(2020, 'Bacterial eye infections', 'Treated with minor operation'),
(2011, 'Broken knee', 'applied cast and later it got fixed'),
(2009, 'Dengue', 'normal treatment at the hospital'),
(2008, 'broken finger', 'fixed with operation');

commit;