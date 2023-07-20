import './ExploreContainer.css';

import React, {useState} from "react";
import { HomePage } from "../pages/HomePage";

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {

  return (
    <div id="container">
        <HomePage />
    </div>
  );
};

export default ExploreContainer;
