import React from "react";
import "../../Styles/Home.css"

const Card = (props) => {

  return (
    <div className="card-container">
      <div>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

export default Card;
