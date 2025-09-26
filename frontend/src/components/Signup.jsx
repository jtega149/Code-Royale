import React from "react";
import "./Signup.css";

const Signup = () => {
  return (
    <div className="signup-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form className="signup-form">
        <h3>Sign Up</h3>

        <label htmlFor="email">Email</label>
        <input type="text" placeholder="Email" id="email" />

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" />

        <label htmlFor="confirm">Confirm Password</label>
        <input type="password" placeholder="Confirm Password" id="confirm" />

        <button type="submit">Sign Up</button>

        <div className="social">
          <div className="google">Google</div>
          <div className="facebook">Facebook</div>
        </div>
      </form>
    </div>
  );
};

export default Signup;