import express from "express"; // Import the Express framework
const cors = require("cors"); // Import the CORS middleware
require("dotenv").config(); // Load environment variables from a .env file into process.env

// LOCALE DEFINITIONS
// ROUTES
import {
  customerRouter,
  authenticationRouter,
  userRouter,
  shopRouter,
  supplierRouter,
  brandRouter,
  categoryRouter,
  productRouter,
  unitRouter,
  saleRouter,
  expenseCategoriesRouter,
  expenseRouter,
  payeeRouter,
} from "./routes/";

// MIDDLEWARES
import { generalLimitter } from "./middleware/rateLimitMiddleware";

// CREATE APP
const app = express(); // Create an Express application instance

// ADD MIDDLEWARE
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(generalLimitter); //
app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body

// DEFINITION PORT
const PORT = process.env.PORT || 8000; // Set the server's port from environment variables or default to 8000

app.listen(PORT, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});

// ROUTES
app.use("/api/v1/auth", authenticationRouter);
app.use("/api/v1", brandRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", saleRouter);
app.use("/api/v1", shopRouter);
app.use("/api/v1", supplierRouter);
app.use("/api/v1", unitRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", expenseCategoriesRouter);
app.use("/api/v1", expenseRouter);
app.use("/api/v1", payeeRouter);
