CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NOMAXVALUE;

CREATE TABLE Users (
    userid NUMBER DEFAULT user_id_seq.NEXTVAL NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    fullname VARCHAR2(255) GENERATED ALWAYS AS (firstname || ' ' || lastname),
    email VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    blood_group VARCHAR(5),
    phone_number VARCHAR(11),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_USERID PRIMARY KEY (userid)
);

ALTER TABLE USERS
ADD CONSTRAINT CHK_PGONE CHECK (LENGTH(PHONE_NUMBER)=11);

CREATE TABLE Passwords (
    userid NUMBER NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    CONSTRAINT FK_USERID FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE
);

CREATE TABLE doctors (
    doctor_id NUMBER PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    practiced_area VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL
);

drop table doctors;

INSERT INTO doctors (doctor_id, doctor_name, department, practiced_area, gender) VALUES (1, 'Dr. John Doe', 'Cardiology', 'Dhaka', 'Male');
INSERT INTO doctors (doctor_id, doctor_name, department, practiced_area, gender) VALUES (2, 'Dr. Jane Smith', 'Neurology', 'Khulna', 'Female');
INSERT INTO doctors (doctor_id, doctor_name, department, practiced_area, gender) VALUES (3, 'Dr. Alice Johnson', 'Pediatrics', 'Chittagong', 'Female');
INSERT INTO doctors (doctor_id, doctor_name, department, practiced_area, gender) VALUES (4, 'Dr. Robert Brown', 'Orthopedics', 'Sylhet', 'Male');
INSERT INTO doctors (doctor_id, doctor_name, department, practiced_area, gender) VALUES (5, 'Dr. Emily Davis', 'Gynecology', 'Mymensingh', 'Female');

select * from doctors;

SELECT * FROM doctors
      WHERE TRIM(LOWER(practiced_area)) = TRIM(LOWER('Khulna'))
      AND TRIM(LOWER(department)) = TRIM(LOWER('Neurology'));
COMMIT;