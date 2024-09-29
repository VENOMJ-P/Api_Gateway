# API Gateway

This is an API Gateway implemented using Node.js and Express. It acts as a single entry point for multiple microservices, providing an interface to manage and route requests efficiently.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Rate Limiting](#rate-limiting)
- [Authentication Middleware](#authentication-middleware)
- [Services](#services)
- [Logging](#logging)
- [Contributing](#contributing)
- [License](#license)

## Features

- Routes requests to multiple microservices.
- Implements rate limiting to prevent abuse.
- Performs authentication checks before allowing access to specific services.
- Uses logging middleware to track requests.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory to specify your environment variables. An example configuration might look like this:

   ```plaintext
   PORT=3000
   ```

## Configuration

Before running the application, ensure that the services you want to proxy are running on the specified ports. You can adjust the target URLs in the middleware configuration as needed.

## Usage

To start the API Gateway, run the following command:

```bash
npm start
```

The server will start and listen on the specified port (default is set in the `.env` file).

## Rate Limiting

The API Gateway uses rate limiting to control the number of requests a client can make in a given time window. The configuration is set to allow a maximum of 5 requests every 2 minutes.

## Authentication Middleware

The API Gateway checks if requests to the `/bookingservice` endpoint are authenticated by verifying a token sent in the request headers. It does this by calling an authentication service running at `http://localhost:3001/api/v1/isAuthenticated`.

### Usage

Include the following header in your requests to the `/bookingservice` endpoint:

```plaintext
x-access-token: <your-access-token>
```

If the token is valid, the request will be processed; otherwise, a `401 Unauthorized` response will be returned.

## Services

The API Gateway routes requests to the following services:

- **Booking Service**: `/bookingservice`

  - Target: `http://localhost:3002/`

- **Auth Service**: `/authService`

  - Target: `http://localhost:3001/`

- **Search Service**: `/searchService`

  - Target: `http://localhost:3000/`

- **Reminder Service**: `/reminderService`
  - Target: `http://localhost:3003/`

## Logging

The API Gateway uses the `morgan` library to log incoming requests in the "combined" format, which provides detailed information about each request.
