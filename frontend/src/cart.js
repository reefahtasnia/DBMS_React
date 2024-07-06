import React, { useState } from 'react';
import './CSS/cart.css'; // Adjust the path as needed

const Cart = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: 150, quantity: 1 },
    { id: 2, name: 'Product 2', price: 150, quantity: 1 },
    { id: 3, name: 'Product 3', price: 150, quantity: 1 },
  ]);

  const handleQuantityChange = (id, change) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = product.quantity + change;
        if (newQuantity > 0) {
          return { ...product, quantity: newQuantity };
        }
      }
      return product;
    }));
  };

  const handleRemove = id => {
    setProducts(products.filter(product => product.id !== id));
  };

  const subtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div>
      <div className="container-fluid bg-secondary mb-5">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
          <h1 className="font-weight-semi-bold text-uppercase mb-3">Shopping Cart</h1>
          <div className="d-inline-flex">
            <p className="m-0"><a href="/">Home</a></p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Shopping Cart</p>
          </div>
        </div>
      </div>

      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-bordered text-center mb-0">
              <thead className="bg-secondary text-dark">
                <tr>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="align-middle">{product.name}</td>
                    <td className="align-middle">Tk {product.price}</td>
                    <td className="align-middle">
                      <div className="input-group quantity mx-auto" style={{ width: '100px' }}>
                        <div className="input-group-btn">
                          <button className="btn btn-sm btn-primary btn-minus" onClick={() => handleQuantityChange(product.id, -1)}>
                            <i className="fa fa-minus"></i>
                          </button>
                        </div>
                        <input type="text" className="form-control form-control-sm bg-secondary text-center" value={product.quantity} readOnly />
                        <div className="input-group-btn">
                          <button className="btn btn-sm btn-primary btn-plus" onClick={() => handleQuantityChange(product.id, 1)}>
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">Tk {product.price * product.quantity}</td>
                    <td className="align-middle"><button className="btn btn-sm btn-primary" onClick={() => handleRemove(product.id)}><i className="fa fa-times"></i></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-lg-4">
            <div className="card border-secondary mb-5">
              <div className="card-header bg-secondary border-0">
                <h4 className="font-weight-semi-bold m-0">Cart Summary</h4>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3 pt-1">
                  <h6 className="font-weight-medium">Subtotal</h6>
                  <h6 className="font-weight-medium">Tk {subtotal}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">Tk {shipping}</h6>
                </div>
              </div>
              <div className="card-footer border-secondary bg-transparent">
                <div className="d-flex justify-content-between mt-2">
                  <h5 className="font-weight-bold">Total</h5>
                  <h5 className="font-weight-bold">Tk {total}</h5>
                </div>
                <button className="btn btn-block btn-primary my-3 py-3">Confirm Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
