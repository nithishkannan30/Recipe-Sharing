const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./db/config");
const Home = require("./controllers/controller");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./Middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an instance of Express

// Middleware setup
app.use(express.json()); // To parse JSON bodies
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow only your frontend origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//   credentials: true // Allow credentials (if needed)
// }));
app.use(cors())

// Route handlers
app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", ForgotPassword);

// Protected route example
app.get("/auth/", verifyToken, Home.Home);

// Start the server only if the config is successful
if (config) {
  const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
} else {
  console.error("Database connection failed. Server not started.");
}
