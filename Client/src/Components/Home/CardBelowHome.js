import React from 'react';
import HomeDarkCardLeftPic from "./images/HomeDarkCardLeftPic.png";
import HomeDarkCardRightPic from "./images/HomeDarkCardRightPic.png";
import "../../Styles/Home.css"

const formatNumber = (number) => {
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  const suffixNum = Math.floor(('' + number).length / 3);
  const shortNumber = parseFloat((number / Math.pow(1000, suffixNum)).toFixed(1));
  return shortNumber >= 1 ? `${shortNumber}${suffixes[suffixNum]}${"+"}` : number.toString();
};

const CardBelowHome = () => {
  const adoptedPets = formatNumber(1212);
  
  return (
    <div className='dark-grey-container'>
      <div className='left-pic'>
        <img src={HomeDarkCardLeftPic} alt="Dog with toy" />
      </div>
      <div className='left-para'>
        <p>
          <span className='adopted-pets-num'>{adoptedPets}</span>
          Furry Friends<br/>Living Their Best Lives
        </p>
      </div>
      <div className='right-pic'>
        <img src={HomeDarkCardRightPic} alt="Happy dog" />
      </div>
      <div className='right-para'>
        <p className='we-do'>WHAT WE DO?</p>
        <p>"With a focus on pet adoption and reuniting lost pets with their families, FetchMeHome makes it easy to find a loving companion or bring a missing pet back home."</p>
      </div>
    </div>
  );
};

export default CardBelowHome;