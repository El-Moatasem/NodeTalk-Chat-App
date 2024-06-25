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
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://127.0.0.1:6379
```

