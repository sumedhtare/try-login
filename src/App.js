import React, { useState, useRef, useEffect } from "react";
import './LoginPage.css';

var initPosition = { top: 50, left: 100 }

const RunawayButton = () => {
  const boxRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState(initPosition);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
      setShowAlert(true);
  };


  const handleMouseMove = (e) => {
    const box = boxRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const buttonCenterX = button.left + button.width / 2;
    const buttonCenterY = button.top + button.height / 2;

    const distanceX = mouseX - buttonCenterX;
    const distanceY = mouseY - buttonCenterY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const moveThreshold = 150; // Distance within which button moves away

    if (distance < moveThreshold) {
      const maxX = box.width - button.width;
      const maxY = box.height - button.height;

      // Calculate the angle between mouse and button center
      const angle = Math.atan2(distanceY, distanceX);

      // Move in the circular opposite direction (rotating counterclockwise)
      const moveRadius = 50; // How far the button moves in circular motion
      const newLeft = initPosition.left - moveRadius * Math.cos(angle + Math.PI / 2);
      const newTop = initPosition.top - moveRadius * Math.sin(angle + Math.PI / 2);

      // Ensure the button stays within bounds of the box
      let boundedLeft = Math.min(Math.max(newLeft, 0), maxX);
      let boundedTop = Math.min(Math.max(newTop, 0), maxY);

      setPosition({ left: boundedLeft, top: boundedTop });

       // Set tilt towards the center of the box
       const centerX = box.width / 2;
       const centerY = box.height / 2;
       // Tilt ranges between -40 and 40 degrees, based on button's position from center
       const maxTilt = 40;
       const tiltFactorX = ((centerY - boundedTop) / centerY) * maxTilt; // Y axis tilt
       const tiltFactorY = ((centerX - boundedLeft) / centerX) * maxTilt; // X axis tilt
 
       setTiltX(tiltFactorX);
       setTiltY(tiltFactorY);
    }
  };


  const handleMouseLeave = () => {
    // Move the button to the center of the box
    const box = boxRef.current.getBoundingClientRect();
    const centerX = (box.width - buttonRef.current.offsetWidth) / 2;
    const centerY = (box.height - buttonRef.current.offsetHeight) / 2;

    setPosition({ left: centerX, top: centerY });
    setTiltX(0); // Reset tilt when button moves to center
    setTiltY(0);
  };

  useEffect(()=>{
    initPosition = position
  },[position])

  useEffect(() => {
    const box = boxRef.current;
    box.addEventListener("mousemove", handleMouseMove);
    box.addEventListener("mouseleave", handleMouseLeave);
    handleMouseLeave();
    return () => {
      box.removeEventListener("mousemove", handleMouseMove);
      box.removeEventListener("mouseleave", handleMouseLeave);

    }
  }, []);


  const closeAlert = () => {
    setShowAlert(false);
  };

  return (


    <div className="login-container">
       {showAlert && (
        <div className="custom-alert">
          <p>Hurray !!!!</p>
          <button onClick={closeAlert} className="close-alert-btn">
            Close
          </button>
        </div>
      )}
    <div className="login-box">
      <h2>Try login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            required
          
          />
          <label>Email</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            required
            
          />
          <label>Password</label>
        </div>
         <div
      ref={boxRef}
      className="login-btn-container"
    >
      <button
        ref={buttonRef}
        style={{
          width: "100px",
          height: "50px",
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
          transition: "top 0.2s ease, left 0.2s ease, transform 0.2s ease", // Smooth animation
          transform: `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`, // 3D tilt
        }}
        className="login-btn"
      >
        Login!
      </button>
    </div>
      </form>
    </div>
  </div>
)
   
  
};

export default RunawayButton;
