import React, { useState } from "react";
import axios from "axios";
import "../../Styles/Personality.css";

// Quiz Data
const petPersonalityQuiz = [
  {
    question: "What best describes your daily activity level?",
    options: [
      { label: "Always on the move, love outdoor activities", icon: "🏃‍♂️", value: "A" },
      { label: "Enjoy occasional walks and light exercise", icon: "🚶‍♂️", value: "B" },
      { label: "Prefer relaxing at home most of the time", icon: "🛋", value: "C" }
    ]
  },
  {
    question: "How much time can you dedicate to your pet daily?",
    options: [
      { label: "Several hours – I love spending time with animals!", icon: "🕒", value: "A" },
      { label: "A few hours – I can make time for care and play", icon: "⏳", value: "B" },
      { label: "Limited – I have a busy schedule but still want a companion", icon: "⏰", value: "C" }
    ]
  },
  {
    question: "How do you feel about grooming and maintenance?",
    options: [
      { label: "I enjoy grooming and don't mind frequent upkeep", icon: "✂️", value: "A" },
      { label: "Moderate grooming is fine", icon: "🧼", value: "B" },
      { label: "I prefer low-maintenance pets", icon: "🏠", value: "C" }
    ]
  },
  {
    question: "What is your home environment like?",
    options: [
      { label: "Spacious home with a backyard", icon: "🏡", value: "A" },
      { label: "Apartment or small living space", icon: "🏢", value: "B" },
      { label: "Busy city with limited outdoor access", icon: "🌆", value: "C" }
    ]
  },
  {
    question: "How do you handle noise and energy levels in a pet?",
    options: [
      { label: "Love energetic pets – bring on the fun!", icon: "🔊", value: "A" },
      { label: "Balanced – playful but calm", icon: "😌", value: "B" },
      { label: "Quiet and relaxed please", icon: "🤫", value: "C" }
    ]
  },
  {
    question: "What temperament are you looking for?",
    options: [
      { label: "Loyal, protective, always by my side", icon: "🧡", value: "A" },
      { label: "Playful, affectionate, good with everyone", icon: "🎭", value: "B" },
      { label: "Independent and calm", icon: "💤", value: "C" }
    ]
  },
  {
    question: "How social are you?",
    options: [
      { label: "Very social! Love company", icon: "🎉", value: "A" },
      { label: "Somewhat social", icon: "👫", value: "B" },
      { label: "Introverted", icon: "☕", value: "C" }
    ]
  }
];

const Personality = () => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [personality, setPersonality] = useState("");
  const [loading, setLoading] = useState(false);
  const [breedSuggestions, setBreedSuggestions] = useState({ dogs: [], cats: [] });
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [activeTab, setActiveTab] = useState("dog");
  const [loadingBreeds, setLoadingBreeds] = useState(false);

  const handleAnswerSelect = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [petPersonalityQuiz[questionIndex].question]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < petPersonalityQuiz.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const isNextButtonDisabled = () => {
    const currentQuestion = petPersonalityQuiz[currentQuestionIndex].question;
    return !answers[currentQuestion];
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/personality", { answers });
      setPersonality(res.data.personality);
      setShowResults(true);
      fetchBreedSuggestions(res.data.personality);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreedSuggestions = async (traits) => {
    if (!traits) return;
    setLoadingBreeds(true);
    try {
      const res = await axios.get("http://localhost:4000/api/suggest-breeds", {
        params: { traits }
      });
      setBreedSuggestions({
        dogs: res.data.dogs || [],
        cats: res.data.cats || []
      });
    } catch (err) {
      console.error("Fetch breed error:", err);
    } finally {
      setLoadingBreeds(false);
    }
  };

  const handleSavePet = async (pet) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save pets to your favorites");
      return;
    }
    
    try {
      await axios.post("http://localhost:4000/api/users/save-pet", pet, {
        headers: { 
          Authorization: token,
          "Content-Type": "application/json"
        }
      });
      alert(`${pet.name} saved to your favorites!`);
    } catch (error) {
      console.error("Error saving pet:", error);
      alert("Failed to save pet.");
    }
  };

  const openModal = (breed) => {
    setSelectedBreed(breed);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBreed(null);
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setPersonality("");
    setShowResults(false);
    setBreedSuggestions({ dogs: [], cats: [] });
  };

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / petPersonalityQuiz.length) * 100;

  if (showResults) {
    return (
      <div className="personality-container">
        <div className="personality-results">
          <h1>Your Pet Match Results</h1>
          
          <div className="personality-traits">
            <h2>Your Personality Traits</h2>
            <div className="traits-box">
              {personality.split(", ").map((trait, index) => (
                <span key={index} className="trait-pill">{trait}</span>
              ))}
            </div>
            <p className="traits-description">
              Based on your answers, these traits best describe your lifestyle and preferences when it comes to pet companionship.
            </p>
          </div>
          
          <div className="breed-suggestions">
            <h2>Recommended Pet Breeds</h2>
            
            <div className="breed-tabs">
              <button 
                className={`tab-button ${activeTab === 'dog' ? 'active' : ''}`}
                onClick={() => setActiveTab('dog')}
              >
                Dogs
              </button>
              <button 
                className={`tab-button ${activeTab === 'cat' ? 'active' : ''}`}
                onClick={() => setActiveTab('cat')}
              >
                Cats
              </button>
            </div>
            
            {loadingBreeds ? (
              <div className="loading-breeds">
                <div className="spinner"></div>
                <p>Finding perfect matches for you...</p>
              </div>
            ) : (
              <div className="breed-cards">
                {(activeTab === 'dog' ? breedSuggestions.dogs : breedSuggestions.cats).length > 0 ? (
                  (activeTab === 'dog' ? breedSuggestions.dogs : breedSuggestions.cats).map((breed, index) => (
                    <div key={index} className="breed-card">
                      {breed.image?.url ? (
                        <div className="breed-image">
                          <img src={breed.image.url} alt={breed.name} />
                        </div>
                      ) : (
                        <div className="breed-image no-image">
                          <span>No image available</span>
                        </div>
                      )}
                      <div className="breed-info">
                        <h3>{breed.name}</h3>
                        <p className="breed-temperament">{breed.temperament}</p>
                        <div className="breed-actions">
                          <button 
                            className="view-details-btn"
                            onClick={() => openModal(breed)}
                          >
                            View Details
                          </button>
                          <button 
                            className="save-breed-btn"
                            onClick={() => handleSavePet(breed)}
                          >
                            Save <i className="fa fa-heart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-breeds-message">
                    No {activeTab === 'dog' ? 'dog' : 'cat'} breeds match your personality traits. Try a different pet type or retake the quiz.
                  </p>
                )}
              </div>
            )}
          </div>
          
          <button onClick={resetQuiz} className="reset-quiz-btn">
            <i className="fa fa-refresh"></i> Retake Quiz
          </button>
        </div>
        
        {/* Breed Details Modal */}
        {showModal && selectedBreed && (
          <div className="modal-overlay">
            <div className="modal-container breed-modal">
              <div className="modal-header">
                <h2>{selectedBreed.name}</h2>
                <button className="close-modal-btn" onClick={closeModal}>×</button>
              </div>
              <div className="modal-content">
                <div className="breed-modal-content">
                  {selectedBreed.image?.url && (
                    <div className="breed-modal-image">
                      <img src={selectedBreed.image.url} alt={selectedBreed.name} />
                    </div>
                  )}
                  
                  <div className="breed-modal-details">
                    <div className="breed-detail-item">
                      <h4>Temperament:</h4>
                      <p>{selectedBreed.temperament || "Information not available"}</p>
                    </div>
                    
                    <div className="breed-detail-item">
                      <h4>Life Span:</h4>
                      <p>{selectedBreed.life_span || "Information not available"}</p>
                    </div>
                    
                    {selectedBreed.weight && (
                      <div className="breed-detail-item">
                        <h4>Weight:</h4>
                        <p>{selectedBreed.weight.metric || "Information not available"} kg</p>
                      </div>
                    )}
                    
                    {selectedBreed.breed_group && (
                      <div className="breed-detail-item">
                        <h4>Breed Group:</h4>
                        <p>{selectedBreed.breed_group}</p>
                      </div>
                    )}
                    
                    <div className="breed-modal-actions">
                      <button 
                        className="save-breed-btn large"
                        onClick={() => handleSavePet(selectedBreed)}
                      >
                        Save to Favorites <i className="fa fa-heart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="personality-container">
      <div className="personality-quiz">
        <h1>Pet Personality Quiz</h1>
        <p className="quiz-intro">
          Find your perfect pet match by answering a few simple questions about your lifestyle and preferences!
        </p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <span className="progress-text">Question {currentQuestionIndex + 1} of {petPersonalityQuiz.length}</span>
        </div>
        
        <div className="question-container">
          <h2>{petPersonalityQuiz[currentQuestionIndex].question}</h2>
          
          <div className="options-container">
            {petPersonalityQuiz[currentQuestionIndex].options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                className={`option-card ${answers[petPersonalityQuiz[currentQuestionIndex].question] === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestionIndex, option.value)}
              >
                <div className="option-icon">{option.icon}</div>
                <div className="option-label">{option.label}</div>
              </div>
            ))}
          </div>
          
          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button onClick={handleBack} className="back-button">
                <i className="fa fa-arrow-left"></i> Back
              </button>
            )}
            
            <button 
              onClick={handleNext} 
              disabled={isNextButtonDisabled() || loading}
              className="next-button"
            >
              {loading ? (
                <div className="spinner-small"></div>
              ) : currentQuestionIndex === petPersonalityQuiz.length - 1 ? (
                <>See Results <i className="fa fa-paw"></i></>
              ) : (
                <>Next <i className="fa fa-arrow-right"></i></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personality;