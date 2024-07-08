CREATE TABLE products (
    productId NUMBER PRIMARY KEY,
    title VARCHAR2(255) NOT NULL,
    price NUMBER NOT NULL,
    stock NUMBER NOT NULL,
    image VARCHAR2(255) NOT NULL
);


CREATE TABLE cart (
  productid NUMBER PRIMARY KEY,
  title VARCHAR2(255),
  price NUMBER,
  image VARCHAR2(255),
  quantity NUMBER
);