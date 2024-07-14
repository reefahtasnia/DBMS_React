import React from 'react';
import './CSS/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import medicalHistory from './CSS/assets/medical_history2.png';
import doctorPatient from './CSS/assets/doctor and patient.png';
import reminders from './CSS/assets/reminders.png';
import pregnancyShop from './CSS/assets/pregnancy_shop.png';
import bloodDonor from './CSS/assets/bloodDonor.png';
import pregnancyResources from './CSS/assets/pregnancy_resources.png';
import pregnancyPillow from './CSS/assets/pregnancypillow.jpeg';
import prenatalVitamins from './CSS/assets/prenatal_vitamins.jpg';
import diaper from './CSS/assets/diaper.png';
import babyWipes from './CSS/assets/baby_wipes.jpg';
import maternityDress from './CSS/assets/maternity_dress.png';
import stretchMarkOil from './CSS/assets/stretch_mark_oil.jpg';


const Home = () => {
  return (
    <div style={{ backgroundColor: 'white' }}>
      <section className="main">
        <div className="container py-5">
          <div className="row py-4">
            <div className="col-lg-7 pt-5 text-center">
              <h1 className="pt-5">Because you matter the most in motherhood</h1>
              <button className="btn1 mt-3" id="loginButton" onClick={(e) => window.location.href = '/signup'}>Get Started</button>
            </div>
          </div>
        </div>
      </section>
      <section className="feature">
        <div className="container py-5">
          <div className="row py-5 justify-content-center">
            <div className="col-lg-5 m-auto text-center">
              <h1>FEATURES</h1>
            </div>
          </div>
          <div className="row justify-content-center">
            {features.map((feature, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={index}>
                <div className="card border-0 h-100">
                  <div className="card-body text-center">
                    <img src={feature.image} alt="" className="img-fluid" style={{ maxWidth: '150px', height: 'auto', marginBottom: '15px', marginTop: '10px' }} />
                    <h5>{feature.title}</h5>
                    <p>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="main2">
        <div className="container py-5">
          <div className="row py-4">
            <div className="col-lg-7 pt-5 text-center">
              <h1 className="pt-5">Talk to healthcare professionals and get treatment online</h1>
              <button className="btn1 mt-3" id="loginButton">Book Appointment</button>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-5 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h3 className="mb-3" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Featured Products</h3>
            </div>
            <div className="col-6 text-right">
              <a className="btn mb-3 mr-1" href="#carouselExampleIndicators2" role="button" data-slide="prev">
                <i className="fa fa-arrow-left"></i>
              </a>
              <a className="btn mb-3" href="#carouselExampleIndicators2" role="button" data-slide="next">
                <i className="fa fa-arrow-right"></i>
              </a>
            </div>
            <div className="col-12">
              <div id="carouselExampleIndicators2" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                  {products.map((productGroup, index) => (
                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                      <div className="row">
                        {productGroup.map((product, idx) => (
                          <div className="col-md-4 mb-3" key={idx}>
                            <div className="card">
                              <img className="img-fluid" alt="100%x280" src={product.image} />
                              <div className="card-body">
                                <h4 className="card-title">{product.title}</h4>
                                <p className="card-text">Click to Browse More!</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="footer py-5">
        <div className="container py-2">
          <div className="row">
            <div className="col-lg-10 m-auto text-center">
              <h2>Join us to take care of you and your little one</h2>
              <button className="btn2" id="SignupButton">Sign Up Now!</button>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-11">
              <div className="row">
                <div className="col-lg-6 ">
                  <h4>Maternity Maven</h4>
                  <p>Maternity Maven is a platform that helps you manage your and your child's health effectively.</p>
                </div>
                <div className="col-lg-3">
                  <h4>About</h4>
                  <p><a href="/">Home</a></p>
                  <p><a href="">Features</a></p>
                  <p><a href="">About Us</a></p>
                </div>
                <div className="col-lg-2">
                  <h4>Contact us</h4>
                  <span><i className="fa fa-facebook-official"></i></span>
                  <span><i className="fa fa-instagram" aria-hidden="true"></i></span>
                  <span><i className="fa fa-github"></i></span>
                  <span><i className="fa fa-twitter"></i></span>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <p className="text-center" style={{ marginBottom: '-10px' }}>Copyright @2024 All rights reserved</p>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    image: medicalHistory,
    title: 'Medical History',
    description: 'Log your medical history into your own account.'
  },
  {
    image: doctorPatient,
    title: 'Book Appointments',
    description: 'Schedule an appointment with your doctor.'
  },
  {
    image: reminders,
    title: 'Reminders',
    description: "Set reminders so your memory gap doesn't affect your health."
  },
  {
    image: pregnancyShop,
    title: 'Shop for Supplies',
    description: 'Find all your necessities related to your and your newborn\'s health'
  },
  {
    image: bloodDonor,
    title: 'Blood Donor',
    description: 'Find nearest blood source for emergency blood transfusions.'
  },
  {
    image: pregnancyResources,
    title: 'Information',
    description: 'Find advice and information on your and your newborn\'s health'
  },
];

const products = [
  [
    {
      image: pregnancyPillow,
      title: 'Pregnancy Pillow'
    },
    {
      image: prenatalVitamins,
      title: 'Vitamins'
    },
    {
      image: diaper,
      title: 'Diapers'
    }
  ],
  [
    {
      image: babyWipes,
      title: 'Baby Wipes'
    },
    {
      image: maternityDress,
      title: 'Maternity Dresses'
    },
    {
      image: stretchMarkOil,
      title: 'Stretch Mark Oil'
    }
  ]
];

export default Home;
