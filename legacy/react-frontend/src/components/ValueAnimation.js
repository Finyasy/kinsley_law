import React, { useState, useEffect } from 'react';
import '../styles/ValueAnimation.css';

const ValueAnimation = () => {
  const values = ['INTEGRITY', 'TEAM WORK', 'MASTERY', 'CLIENT EXPERIENCE'];
  const [currentValueIndex, setCurrentValueIndex] = useState(0);
  const [animationState, setAnimationState] = useState('entering');

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setAnimationState('active');
    }, 500);

    const activeTimer = setTimeout(() => {
      setAnimationState('exiting');
    }, 3000);

    const exitTimer = setTimeout(() => {
      setAnimationState('entering');
      setCurrentValueIndex((prevIndex) => (prevIndex + 1) % values.length);
    }, 3500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(activeTimer);
      clearTimeout(exitTimer);
    };
  }, [currentValueIndex, values.length]);

  return (
    <div className="value-animation-container">
      <div className="value-header">
        <h2>Excellence. In Law</h2>
      </div>
      <div className="value-display">
        <div className={`value-text ${animationState}`}>
          {values[currentValueIndex]}
        </div>
      </div>
    </div>
  );
};

export default ValueAnimation;