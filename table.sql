CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NOMAXVALUE;

CREATE OR REPLACE TYPE Address_Type AS OBJECT (
    Street   VARCHAR2(100),
    Region   VARCHAR2(50),
    District VARCHAR2(50),
    Country  VARCHAR2(50)
);
/
CREATE TABLE Users (
    userid NUMBER DEFAULT user_id_seq.NEXTVAL NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    fullname VARCHAR2(255) GENERATED ALWAYS AS (firstname || ' ' || lastname),
    email VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    blood_group VARCHAR(5),
    phone_number VARCHAR(16),
    address Address_Type,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT PK_USERID PRIMARY KEY (userid)
);


ALTER TABLE USERS 
ADD CONSTRAINT CHK_PHONE CHECK (LENGTH(PHONE_NUMBER) BETWEEN 11 AND 16);


CREATE TABLE Doctors (
    BMDC VARCHAR(100) NOT NULL,
    fullname VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) NOT NULL,
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

COMMIT;