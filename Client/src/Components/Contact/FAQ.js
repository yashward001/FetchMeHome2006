import React, { useState } from "react";
import "../../Styles/FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is FetchMeHome?",
      answer:
        "FetchMeHome is a platform designed to help pet owners find their lost pets, facilitate pet adoptions, and allow users to report found pets. It connects owners, adopters, and pet finders to ensure pets find their way home.",
      category: "general"
    },
    {
      question: "Do I need an account to use FetchMeHome?",
      answer:
        "While you can browse lost pet and adoption listings without an account, you need to create one to report a lost pet, adopt a pet, or submit reports.",
      category: "general"
    },
    {
      question: "How do I create an account?",
      answer:
        'Click "Register", enter your full name, email, password, and phone number, then verify your email to start using FetchMeHome.',
      category: "account"
    },
    {
      question: "Is FetchMeHome free to use?",
      answer:
        "Yes! FetchMeHome is completely free for users who want to report lost pets or adopt pets.",
      category: "general"
    },
    {
      question: "How do I report a lost pet?",
      answer:
        "1. Log in to your account.\n2. Click 'Services' on your dashboard.\n3. Fill in the required details (pet's name, type, last seen location, description).\n4. Upload images and submit the listing.",
      category: "lost-pets"
    },
    {
      question: "How do I adopt a pet?",
      answer:
        "1. Browse available adoption listings.\n2. Click 'Show Interest' on the pet you're interested in.\n3. Fill in the required details, including housing situation and pet history.\n4. Wait for the owner to review and respond.",
      category: "adoption"
    },
    {
      question: "How do I find lost pets near me?",
      answer:
        "Use the 'Find' feature to filter results based on location and pet type. A real-time map will display the last seen locations of lost pets.",
      category: "lost-pets"
    },
    {
      question: "How can I report a user or a suspicious listing?",
      answer:
        "1. Go to the user's profile or listing.\n2. Click 'Report' and provide evidence (images, justification).\n3. Admins will review your report and take appropriate action.",
      category: "report"
    },
    {
      question: "What happens after I report a user or listing?",
      answer:
        "Admins will review the case and may:\n- Remove inappropriate listings.\n- Ban users for misconduct.\n- Dismiss false reports.",
      category: "report"
    },
    {
      question: "How can I contact FetchMeHome support?",
      answer:
        "For further assistance, email support@fetchmehome.com or visit our Help Center.",
      category: "general"
    },
    {
      question: "What types of pets can I find on FetchMeHome?",
      answer:
        "FetchMeHome supports listings for various pets including dogs, cats, birds, rabbits, fish, and other small animals.",
      category: "general"
    },
    {
      question: "How does the Pet Personality Quiz work?",
      answer:
        "The Pet Personality Quiz analyzes your lifestyle and preferences to suggest pet breeds that would match well with your personality and living situation. It's a great way to find a compatible pet!",
      category: "adoption"
    },
    {
      question: "Can I post multiple pets for adoption?",
      answer:
        "Yes, you can post multiple pets for adoption. Each pet requires a separate listing with detailed information and photos.",
      category: "adoption"
    },
    {
      question: "How long does my lost pet listing stay active?",
      answer:
        "Lost pet listings remain active for 60 days. After that, you can renew the listing if your pet is still missing.",
      category: "lost-pets"
    },
    {
      question: "Can I edit my pet listing after posting?",
      answer:
        "Yes, you can edit your pet listings at any time through your user dashboard. Just navigate to 'My Panel' and select the listing you want to update.",
      category: "account"
    },
  ];

  // Filter FAQs based on search query and category
  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from FAQ data
  const categories = ["all", ...new Set(faqData.map(item => item.category))];

  return (
    <div className="faq-page">
      <div className="faq-hero">
        <h1>How Can We Help You?</h1>
        <p>Find answers to frequently asked questions about FetchMeHome</p>
        
        <div className="faq-search">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      
      <div className="faq-container">
        <div className="faq-categories">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="faq-list">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? "open" : ""}`}
              >
                <div 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3>{item.question}</h3>
                  <span className="faq-toggle">
                    {activeIndex === index ? (
                      <i className="fa fa-minus-circle"></i>
                    ) : (
                      <i className="fa fa-plus-circle"></i>
                    )}
                  </span>
                </div>
                
                {activeIndex === index && (
                  <div className="faq-answer">
                    {item.answer.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="fa fa-search"></i>
              <h3>No results found</h3>
              <p>Sorry, we couldn't find any matches for your search. Try different keywords or browse all categories.</p>
              <button className="reset-search" onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}>
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="contact-section">
        <h2>Still have questions?</h2>
        <p>If you cannot find an answer to your question, feel free to contact us directly.</p>
        <div className="contact-options">
          <a href="mailto:support@fetchmehome.com" className="contact-option">
            <i className="fa fa-envelope"></i>
            <h4>Email Support</h4>
            <p>support@fetchmehome.com</p>
          </a>
          <a href="tel:+1234567890" className="contact-option">
            <i className="fa fa-phone"></i>
            <h4>Call Us</h4>
            <p>+1 (234) 567-890</p>
          </a>
          <div className="contact-option">
            <i className="fa fa-comments"></i>
            <h4>Live Chat</h4>
            <p>Available 9 AM - 5 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;