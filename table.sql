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
    phone_number VARCHAR(16),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_USERID PRIMARY KEY (userid)
);


ALTER TABLE USERS 
ADD CONSTRAINT CHK_PHONE CHECK (LENGTH(PHONE_NUMBER) BETWEEN 11 AND 16);

CREATE TABLE Doctors (
    BMDC VARCHAR(100) NOT NULL,
    fullname VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) NOT NULL UNIQUE,
    gender VARCHAR2(10),
    phone VARCHAR2(15),
    dept VARCHAR2(100),
    mbbsYear VARCHAR2(4) NOT NULL,
    hosp VARCHAR2(255),
    chamber VARCHAR2(255),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_BMDC PRIMARY KEY (BMDC)
);


CREATE TABLE Passwords (
    userid NUMBER ,
    hashed_password VARCHAR(255),
    BMDC VARCHAR(100),
    CONSTRAINT FK_USERID FOREIGN KEY (userid) REFERENCES Users(userid) ON DELETE CASCADE,
    CONSTRAINT FK_BMDC FOREIGN KEY (BMDC) REFERENCES Doctors(BMDC) ON DELETE CASCADE
);

CREATE TABLE Medical_History (
    user_id INT,
    year INT,
    incident VARCHAR(255),
    treatment VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
CREATE TABLE Medicine (
    medicine_code INT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    dosage INT,
    time TIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
CREATE TABLE Appointment (
    appointment_id INT PRIMARY KEY,
    BMDC_no INT,
    date DATE,
    time TIME,
    day VARCHAR(255),
    FOREIGN KEY (BMDC_no) REFERENCES Doctor(BMDC_no)
);
CREATE TABLE Books (
    booking_id INT PRIMARY KEY,
    user_id INT,
    appointment_id INT,
    date DATE,
    time TIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id)
);
CREATE TABLE Nutrition (
    food_item VARCHAR(255),
    user_id INT,
    serving INT,
    meal_type VARCHAR(255),
    date DATE,
    time TIME,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Shop (
    productId NUMBER PRIMARY KEY,
    product_name VARCHAR2(255) NOT NULL,
    price NUMBER NOT NULL,
    stock NUMBER NOT NULL,
    image VARCHAR2(255) NOT NULL
);

CREATE TABLE Places (
    user_id INT,
    order_item_id INT,
    date DATE,
    quantity INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (order_item_id) REFERENCES Order_Item(order_item_id)
);

CREATE TABLE cart (
  productid NUMBER PRIMARY KEY,
  title VARCHAR2(255),
  price NUMBER,
  image VARCHAR2(255),
  quantity NUMBER
);

CREATE TABLE Admin (
    admin_id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone_no VARCHAR(255)
);

CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY,
    description VARCHAR(255),
    rate INT,
    user_id INT,
    doctor_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(BMDC_no)
);

