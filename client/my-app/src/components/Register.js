import React, { useState } from "react";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false); 
  const Email = email.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setShowError(true);
      return; // Prevent further execution
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: Email, password }),
        }
      );

      if (response.ok) {
        const user = await response.json();
        if (user.error) {
          toast.warn("User already exists. Try with a different email");
        } else {
          toast.success("Registration successful.");
          localStorage.setItem("token", user.token);
          setTimeout(() => {
            window.location.href = "/";
          }, 4000);
        }
      } else {
        const errorResponse = await response.json();
        toast.error(`Registration failed: ${errorResponse.message || 'Unknown error'}`);
        console.error("Failed to register user:", response.status, errorResponse);
      }
    } catch (error) {
      toast.error("An error occurred while registering the user.");
      console.error(error);
    }
  };

  return (
    <div className="SignupContainer">
      <form action="" onSubmit={handleSubmit}>
        <h2>SignUp</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" // Use 'password' type for better security
          placeholder="Enter Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {showError && (
        <span className="fill-fields-error">Please fill all the fields</span>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
