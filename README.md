ChitChat

A lightweight chat app (React + Vite frontend, Express backend, MongoDB, Socket.IO).

What you need

- Node.js 18.x (tested with 18.16.0)
- npm 9.x
- MongoDB 6.x (local or Atlas)
- Optional: Cloudinary account (images) and Gmail app password (OTP emails)

Quick local setup

1) Backend

- Create `Backend/.env` with these values:

  MONGO_URI=<your-mongo-uri>
  JWT_SECRET_KEY=<secret>
  CLIENT_URL=http://localhost:5173
  CLOUD_NAME=<cloudinary-name>
  API_KEY=<cloudinary-key>
  API_SECRET=<cloudinary-secret>
  GMAIL_USER=<you@gmail.com>
  GMAIL_APP_PASSWORD=<gmail-app-password>
  PORT=5000

- Install and run:

```powershell
cd "d:\All Projects\ChitChat\Backend"
npm install
# dev (auto-reload)
npx nodemon index.js
# or run directly
npm start
```

2) Frontend

- Create `Frontend/.env` with:

  VITE_API_URL=http://localhost:5000

- Install and run:

```powershell
cd "d:\All Projects\ChitChat\Frontend"
npm install
npm run dev
```

Open

- Frontend: http://localhost:5173 (Vite default)
- Backend API: http://localhost:5000 (unless you change `PORT`)

