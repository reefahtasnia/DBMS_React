import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Nav'; // Adjust path as necessary
import Home from './Home'; // Adjust path as necessary
import Shop from './shop'; // Adjust path as necessary
import Cart from './cart'; // Adjust path as necessary
import Shop2 from './shop2';
import Shop3 from './shop3';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop2" element={<Shop2 />} />
          <Route path="/shop3" element={<Shop3 />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
