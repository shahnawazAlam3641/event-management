# Event Chat Application

This is a web application where users can create events, join existing events, and interact with other participants through a chat feature. The application is built using the MERN stack, incorporating authentication with JWT tokens, bcrypt for password hashing, Redux for state management, React Router for navigation, and Vite for development and build. Cloudinary is used to save event thumbnails.

## Features

- **Event Creation**: Users can create events with details such as title, description, category, dates, and an event thumbnail.
- **Event Joining**: Users can join existing events and see the list of attendees.
- **Real-time Chat**: After joining an event, users have access to a chat box where they can communicate in real-time.
- **Authentication**: Secure authentication using JWT tokens and bcrypt for password hashing.
- **State Management**: Redux is used for managing global state.
- **Routing**: React Router is used for seamless navigation within the application.
- **Development and Build**: Vite is used for fast development and building the application.
- **Image Management**: Cloudinary is used to save and serve event thumbnails.

## Tech Stack

- **Frontend**: React, Redux, React Router, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT tokens, bcrypt
- **Real-time Communication**: Socket.IO
- **Image Management**: Cloudinary

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/event-chat-app.git
    cd event-chat-app
    ```

2. **Install frontend dependencies**:
    ```bash
    cd client
    npm install
    ```

3. **Install backend dependencies**:
    ```bash
    cd ../server
    npm install
    ```

## Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:

```env
VITE_WS_URL=<your_websocket_url>
VITE_BACKEND_URL=<your_backend_url>
JWT_SECRET=<your_jwt_secret>
MONGODB_URI=<your_mongodb_uri>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
