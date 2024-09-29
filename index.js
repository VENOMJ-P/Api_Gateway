const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

const {
  PORT,
  AUTH_SERVICE_URL,
  BOOKING_SERVICE_URL,
  SEARCH_SERVICE_URL,
  REMINDER_SERVICE_URL,
} = require("./config/serverConfig");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
});

app.use(morgan("combined"));
app.use(limiter);

// Authentication Middleware
app.use("/bookingservice", async (req, res, next) => {
  try {
    const response = await axios.get(
      `${AUTH_SERVICE_URL}api/v1/isAuthenticated`,
      {
        headers: {
          "x-access-token": req.headers["x-access-token"],
        },
      }
    );

    if (response.data.success) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Authentication failed." });
  }
});

// Create proxy middleware
const createServiceProxy = (servicePath, targetUrl) => {
  app.use(
    servicePath,
    createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
    })
  );
};

// Setup proxy middleware for services
createServiceProxy("/bookingService", BOOKING_SERVICE_URL);
createServiceProxy("/authService", AUTH_SERVICE_URL);
createServiceProxy("/searchService", SEARCH_SERVICE_URL);
createServiceProxy("/reminderService", REMINDER_SERVICE_URL);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
