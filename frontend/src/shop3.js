import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/home.css';
import pregnancyPillow from './CSS/assets/pregnancypillow.jpeg';
import prenatalVitamins from './CSS/assets/prenatal_vitamins.jpg';
import diaper from './CSS/assets/diaper.png';
import babyWipes from './CSS/assets/baby_wipes.jpg';
import maternityDress from './CSS/assets/maternity_dress.png';
import stretchMarkOil from './CSS/assets/stretch_mark_oil.jpg';
import './CSS/shop.css';

const products = [
  [
    {
      image: pregnancyPillow,
      title: 'Pregnancy Pillow',
      price: 'Tk 130.00'
    },
    {
      image: prenatalVitamins,
      title: 'Vitamins',
      price: 'Tk 150.00'
    },
    {
      image: diaper,
      title: 'Diapers',
      price: 'Tk 200.00'
    }
  ],
  [
    {
      image: babyWipes,
      title: 'Baby Wipes',
      price: 'Tk 80.00'
    },
    {
      image: maternityDress,
      title: 'Maternity Dresses',
      price: 'Tk 300.00'
    },
    {
      image: stretchMarkOil,
      title: 'Stretch Mark Oil',
      price: 'Tk 100.00'
    }
  ]
];

const Shop3 = () => {
  const [cart, setCart] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    all: false,
    maternity: false,
    baby: false,
    food: false,
    clothes: false
  });

  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'all') {
      setCheckboxes({
        all: checked,
        maternity: checked,
        baby: checked,
        food: checked,
        clothes: checked
      });
    } else {
      setCheckboxes((prevCheckboxes) => ({
        ...prevCheckboxes,
        [name]: checked,
        all: false
      }));
    }
  };

  return (
    <div className="container-fluid pt-5">
      <div className="row px-xl-5">
        <div className="col-lg-3 col-md-12">
          <div className="border-bottom mb-4 pb-4">
            <h5 className="font-weight-semi-bold mb-4">Categories</h5>
            <form>
              <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="price-all"
                  name="all"
                  checked={checkboxes.all}
                  onChange={handleCheckboxChange}
                />
                <label className="custom-control-label" htmlFor="price-all">All</label>
                <span className="badge border font-weight-normal">1000</span>
              </div>
              <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="price-1"
                  name="maternity"
                  checked={checkboxes.maternity}
                  onChange={handleCheckboxChange}
                />
                <label className="custom-control-label" htmlFor="price-1">Maternity products</label>
                <span className="badge border font-weight-normal">150</span>
              </div>
              <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="price-2"
                  name="baby"
                  checked={checkboxes.baby}
                  onChange={handleCheckboxChange}
                />
                <label className="custom-control-label" htmlFor="price-2">Baby products & toys</label>
                <span className="badge border font-weight-normal">295</span>
              </div>
              <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="price-3"
                  name="food"
                  checked={checkboxes.food}
                  onChange={handleCheckboxChange}
                />
                <label className="custom-control-label" htmlFor="price-3">Food</label>
                <span className="badge border font-weight-normal">246</span>
              </div>
              <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="price-4"
                  name="clothes"
                  checked={checkboxes.clothes}
                  onChange={handleCheckboxChange}
                />
                <label className="custom-control-label" htmlFor="price-4">Clothes</label>
                <span className="badge border font-weight-normal">145</span>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-9 col-md-12">
          <div className="row pb-3">
            <div className="col-12 pb-1">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <form className="input-group" style={{ maxWidth: '300px' }}>
                  <input type="text" className="form-control" placeholder="Search by name" />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary text-dark" type="button">
                      Search
                    </button>
                  </div>
                </form>
                <Link to="/cart" className="btn btn-primary ml-3">Cart</Link>
              </div>
            </div>
            {products.map((productRow, rowIndex) => (
              <div className="row" key={rowIndex}>
                {productRow.map((product, productIndex) => (
                  <div className="col-lg-4 col-md-6 col-sm-12 pb-1" key={productIndex}>
                    <div className="card product-item border-0 mb-4">
                      <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                        <img className="img-fluid w-100" src={product.image} alt={product.title} />
                      </div>
                      <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                        <h6 className="text-truncate mb-3">{product.title}</h6>
                        <div className="d-flex justify-content-center">
                          <h6>{product.price}</h6>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between bg-light border">
                        <button onClick={() => addToCart(product)} className="btn btn-sm text-dark p-0">
                          <i className="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="col-12 pb-1">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mb-3">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                  <li className="page-item"><button className="page-link" onClick={() => navigate('/shop')}>1</button></li>
                  <li className="page-item active"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><button className="page-link" onClick={() => navigate('/shop3')}>3</button></li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop3;
