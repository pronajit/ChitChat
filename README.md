# ChitChat

A real-time chat application built with React, Node.js, MongoDB, and Socket.IO. Send messages instantly, create groups, and upload images—all in one lightweight app.

## Requirements

Make sure you have these installed before you start:

- **Node.js** 18.16.0 or higher (download from [nodejs.org](https://nodejs.org))
- **npm** 9.x or higher (comes with Node.js)
- **MongoDB** 6.x or higher (either locally or cloud-based like MongoDB Atlas)
- A **text editor** (VS Code recommended)

Optional but recommended:
- **Cloudinary account** (for image uploads)
- **Gmail app password** (if you want OTP emails to work)

## Setup

### 1. Clone or download the project

```powershell
cd "d:\All Projects\ChitChat"
```

### 2. Backend Setup

Navigate to the backend folder:

```powershell
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder and add these values:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chitchat
JWT_SECRET_KEY=your-random-secret-key-here
CLIENT_URL=http://localhost:5173
CLOUD_NAME=your-cloudinary-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
PORT=5000
```

**Note:** Get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). For Cloudinary, sign up at [cloudinary.com](https://cloudinary.com).

Start the backend:

```powershell
# Development mode (auto-restart on file changes)
npx nodemon index.js

# Or production mode
npm start
```

You should see: `Server is running on port 5000`

### 3. Frontend Setup

Open a **new terminal** and navigate to the frontend folder:

```powershell
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` folder:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```powershell
npm run dev
```

You should see something like: `➜  Local:   http://localhost:5173/`

## Running the App

Open your browser and go to:

```
http://localhost:5173
```

The backend will be running on `http://localhost:5000` (you don't need to open this, it's just the API).

## Project Structure

```
ChitChat/
├── Backend/          # Express server, routes, controllers
├── Frontend/         # React app with Vite
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Common Issues

**"Cannot connect to MongoDB"**
- Check your `MONGO_URI` in `.env`
- Make sure MongoDB is running (if using local MongoDB)
- Check your IP whitelist on MongoDB Atlas

**"CORS error" or "cookie issues"**
- Make sure `CLIENT_URL` in backend matches your frontend URL (usually `http://localhost:5173`)

**"Emails not sending"**
- Enable 2-factor authentication on your Gmail account
- Generate an app password from your Google Account security settings
- Use that password in `GMAIL_APP_PASSWORD`

## Build for Production

When you're ready to deploy:

**Frontend:**
```powershell
cd Frontend
npm run build
```

This creates a `dist` folder with optimized files ready to deploy.

**Backend:**
Deploy the `Backend` folder to any Node.js hosting (Render, Railway, Heroku, etc.) and set the environment variables there.
