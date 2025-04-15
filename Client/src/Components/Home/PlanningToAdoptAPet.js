  import React from 'react';
  import Card from "./Card";
  import "../../Styles/Home.css"

  const PlanningToAdoptAPet = () => {
    return (
      <div className='planning-container'>
          <h1>Looking to Adopt or Reunite a Lost Pet?</h1>
          <div className='boxes-container'>
              <Card title="The Joy of Pet Adoption" description="Bringing a pet into your life can be an incredibly rewarding experience, not just for you but for the furry friend you welcome into your home. There's a special kind of magic that comes with adopting any companion animal."/>
              <Card title="Bringing Lost Pets Back" description="Reuniting lost pets with their families is a heartfelt mission that requires quick action, community support, and the right resources. The journey may be challenging, but the joy of bringing a pet back home is immeasurable."/>
              <Card title="Healing Power of Animal" description="Animals have an extraordinary ability to touch our lives in profound ways, offering not only companionship but also a therapeutic bond that can positively impact our physical, mental, and emotional well-being"/>
          </div>
      </div>
    )
  }

  export default PlanningToAdoptAPet;