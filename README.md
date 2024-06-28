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


## Configuring MongoDB

1. **Download MongoDB:**
   Visit the [MongoDB Download Center](https://www.mongodb.com/try/download/community) and download the appropriate version for your operating system.

2. **Install MongoDB:**
   Follow the installation instructions for your operating system:
   * **Windows:** Run the downloaded `.msi` file and follow the installation wizard.
   * **macOS:** Use Homebrew to install MongoDB:
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community@4.4
     ```
   * **Linux:** Follow the instructions for your specific distribution from the MongoDB documentation.

3. **Run MongoDB:**
   After installation, start the MongoDB server:
   * **Windows:** Run `mongod` in the Command Prompt.
   * **macOS:** Use Homebrew services to start MongoDB:
     ```bash
     brew services start mongodb-community@4.4
     ```
   * **Linux:** Start the MongoDB service:
     ```bash
     sudo systemctl start mongod
     ```

4. **Verify MongoDB Installation:**
   Open a new terminal window and run:
   ```bash
   mongo




This should open the MongoDB shell. If you see a prompt starting with `>`, MongoDB is running correctly.

## Configuring Redis

1. **Download Redis:**
   Visit the [Redis Download Page](https://redis.io/download) and download the appropriate version for your operating system.

2. **Install Redis:**
   Follow the installation instructions for your operating system:
   * **Windows:** Use the Memurai or Redis for Windows port.
   * **macOS:** Use Homebrew to install Redis:
     ```bash
     brew install redis
     ```
   * **Linux:** Follow the instructions for your specific distribution from the Redis documentation.

3. **Run Redis:**
   After installation, start the Redis server:
   * **Windows:** Run `redis-server` in the Command Prompt.
   * **macOS:** Use Homebrew services to start Redis:
     ```bash
     brew services start redis
     ```
   * **Linux:** Start the Redis service:
     ```bash
     sudo systemctl start redis
     ```

4. **Verify Redis Installation:**
   Open a new terminal window and run:
   ```bash
   redis-cli ping

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


## Caching

The application uses Redis for caching frequently accessed data to improve performance.


## Event Bus

An event bus is implemented using Redis Pub/Sub to facilitate communication between different components of the chat application. Events are published for actions such as:

* User registration
* User login
* Sending messages
* Other relevant actions


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.