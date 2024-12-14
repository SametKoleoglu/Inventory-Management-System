import express from "express"; // Import the Express framework

// ROUTES
import customerRouter from "./routes/customerRoute";
import userRouter from "./routes/userRoute";
import shopRouter from "./routes/shopRoute";
import supplierRouter from "./routes/supplierRoute";

require("dotenv").config(); // Load environment variables from a .env file into process.env
const cors = require("cors"); // Import the CORS middleware
const app = express(); // Create an Express application instance

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes

const PORT = process.env.PORT || 8000; // Set the server's port from environment variables or default to 8000

app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body

app.listen(PORT, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});

// ROUTES
app.use("/api/v1", customerRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", shopRouter);
app.use("/api/v1", supplierRouter);