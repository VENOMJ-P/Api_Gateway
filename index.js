const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const dotenv = require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
});

app.use(morgan("combined"));
app.use(limiter);
app.use("/bookingservice", async (req, res, next) => {
  try {
    //console.log(req.headers['x-access-token']);
    const response = await axios.get(
      "http://localhost:3001/api/v1/isAuthenticated",
      {
        headers: {
          "x-access-token": req.headers["x-access-token"],
        },
      }
    );
    if (response.data.success) {
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorised",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorised",
    });
  }
});

app.use(
  "/bookingService",
  createProxyMiddleware({
    target: "http://localhost:3002/",
    changeOrigin: true,
  })
);
app.use(
  "/authService",
  createProxyMiddleware({
    target: "http://localhost:3001/",
    changeOrigin: true,
  })
);
app.use(
  "/searchService",
  createProxyMiddleware({
    target: "http://localhost:3000/",
    changeOrigin: true,
  })
);
app.use(
  "/reminderService",
  createProxyMiddleware({
    target: "http://localhost:3003/",
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
