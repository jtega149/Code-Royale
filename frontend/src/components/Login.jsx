import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form className="login-form">
        <h3>Login Here</h3>

        <label htmlFor="email">Email</label>
        <input type="text" placeholder="Email or Phone" id="email" />

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" id="password" />

        <button type="submit">Log In</button>

        <div className="social">
          <div className="google">Google</div>
          <div className="facebook">Facebook</div>
        </div>
      </form>
    </div>
  );
};

export default Login;
