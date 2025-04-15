import React from "react";
import '../../Styles/Home.css';

// Import images
import heroImage from "./images/girlHoldingADog.png";
import dogWithToy from "./images/HomeDarkCardLeftPic.png";
import happyDogPic from "./images/HomeDarkCardRightPic.png";
import testimonial1 from "./images/HomeDarkCardLeftPic.png";
import testimonial2 from "./images/HomeDarkCardRightPic.png";
import testimonial3 from "./images/homepageDog.png";

// Import the button components
import PetAdoptionButton from "./PetAdoptionButton";
import FindPetButton from "./FindPetButton";

const Home = () => {
  const stats = [
    { number: "1,200+", label: "Pets Adopted" },
    { number: "500+", label: "Lost Pets Found" },
    { number: "5,000+", label: "Happy Families" },
  ];

  const features = [
    {
      title: "The Joy of Pet Adoption",
      description: "Bringing a pet into your life can be an incredibly rewarding experience, not just for you but for the furry friend you welcome into your home.",
      icon: "heart"
    },
    {
      title: "Bringing Lost Pets Back",
      description: "Reuniting lost pets with their families is a heartfelt mission that requires quick action, community support, and the right resources.",
      icon: "map-marker"
    },
    {
      title: "Healing Power of Animals",
      description: "Animals have an extraordinary ability to touch our lives in profound ways, offering companionship and a therapeutic bond that impacts our wellbeing.",
      icon: "medkit"
    }
  ];

  const testimonials = [
    {
      text: "Thanks to FetchMeHome, I found my perfect furry companion. The process was seamless and supportive!",
      author: "Sarah J.",
      image: testimonial1
    },
    {
      text: "After weeks of searching, FetchMeHome helped me reunite with my lost cat. I'm forever grateful!",
      author: "Michael T.",
      image: testimonial2
    },
    {
      text: "The personality test matched me with the perfect dog for my lifestyle. Couldn't be happier!",
      author: "Emily R.",
      image: testimonial3
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Finding Forever Homes <span className="accent">Together</span>
              </h1>
              <p>
                Whether you're looking to adopt a new companion or reunite with a lost friend,
                we're here to make the journey simple, supportive, and joyful.
              </p>
              <div className="hero-buttons">
                {/* Use both button components next to each other */}
                <PetAdoptionButton 
                  onClick={() => window.location.href = '/pets'} 
                />
                <FindPetButton 
                  onClick={() => window.location.href = '/find'} 
                />
              </div>
            </div>
            <div className="hero-image">
              <img 
                src={heroImage} 
                alt="Happy pet and owner"
                className="floating"
              />
            </div>
          </div>
          <div className="scroll-indicator">
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <div className="arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="container">
          <div className="mission-wrapper">
            <div className="mission-image-left">
              <img src={dogWithToy} alt="Dog with toy" className="mission-img" />
            </div>
            <div className="mission-text-left">
              <p><span className="mission-number">1,200+</span> Furry Friends<br/>Living Their Best Lives</p>
            </div>
            <div className="mission-image-right">
              <img src={happyDogPic} alt="Happy dog" className="mission-img" />
            </div>
            <div className="mission-text-right">
              <p className="mission-label">WHAT WE DO?</p>
              <p>"With a focus on pet adoption and reuniting lost pets with their families, FetchMeHome makes it easy to find a loving companion or bring a missing pet back home."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-wrapper">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Looking to Adopt or Reunite a Lost Pet?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={`fa fa-${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Match?</h2>
            <p>Take our pet personality quiz to discover which animal companion would fit best with your lifestyle.</p>
            <PetAdoptionButton 
              onClick={() => window.location.href = '/personality'} 
              size="large" 
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={`${testimonial.author}`} />
                </div>
                <div className="quote-mark">❝</div>
                <p className="testimonial-text">{testimonial.text}</p>
                <p className="testimonial-author">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;