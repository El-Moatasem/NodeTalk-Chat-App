# NodeTalk Chat Application

NodeTalk is a chat application built using Node.js, Express, MongoDB, and Socket.io. This application allows users to create chat rooms, join public and private chat rooms, and send messages in real-time.

## Features

- User authentication (login/logout)
- Public and private chat rooms
- Real-time messaging using Socket.io
- Search messages
- User and room management

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm (Node Package Manager).
- You have installed MongoDB and it's running on your local machine or a remote server.
- You have a modern web browser.

## Getting Started

To get a local copy up and running, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/El-Moatasem/VOIS_NodeJS_Assessment.git
cd VOIS_NodeJS_Assessment
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nodetalk
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### Start the Application

```bash
yarn start
```

The application will be available at `http://localhost:3000`.


## Project Structure

* `src/`
  * `controllers/`: Contains the controller logic for handling HTTP requests.
  * `models/`: Contains Mongoose models for MongoDB.
  * `services/`: Contains the business logic and integrates with models and other services.
  * `routes/`: Defines the routes for the application.
  * `utils/`: Utility functions and middleware.
  * `app.js`: The main application setup.
  * `server.js`: The server setup and Socket.IO configuration.



## API Endpoints

### Auth

* `POST /api/auth/register`: Register a new user.
* `POST /api/auth/login`: Login a user.
* `POST /api/auth/logout`: Logout a user.


### Users

* `GET /api/users`: Get all users.
* `GET /api/users/:id`: Get a user by ID.

### Chat

* `POST /api/chat/create-room`: Create a new chat room.
* `POST /api/chat/join-room`: Join a chat room.
* `POST /api/chat/leave-room`: Leave a chat room.
* `GET /api/chat/messages/:roomId`: Get messages for a room.
* `POST /api/chat/send-message`: Send a message to a room.

### Socket.IO Events

* `joinRoom`: Join a chat room.
* `leaveRoom`: Leave a chat room.
* `sendMessage`: Send a message to a chat room.
* `message`: Receive a message from a chat room.



## Event Bus

An event bus is implemented using Redis Pub/Sub to facilitate communication between different components of the chat application. Events are published for actions such as:

* User registration
* User login
* Sending messages
* Other relevant actions


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.