DropPoint – Student Lost & Found Tracking System

Objective

DropPoint is a Lost & Found tracking platform designed specifically for students.
Its goal is to make it easier for students to report lost items, post found items, and connect with the rightful owners—all within a secure, user-friendly environment.


---

Functionalities Implemented

Frontend

- React + Vite with TailwindCSS styling
- Login / Register / Dashboard / Profile / Admin pages
- Client-side routing with React Router
- API integration via Axios with JWT auth
- Real-time updates via Socket.IO (new posts/comments update immediately)
- Responsive UI for mobile and desktop


Backend

- Node.js + Express API with MongoDB (Mongoose)
- JWT authentication (login, register)
- Fixed admin account via environment variable (ADMIN_STUDENT_ID)
- Forgot password / reset via email token (SMTP settings in `.env`)
- Post CRUD endpoints with file upload support
- Comments + claim/unclaim logic


Lost & Found Features

Post creation form for lost/found items

Commenting system for each post to communicate with the finder/owner

Ability to delete own comments/posts


Database

MySQL database to store users, posts, and comments

ER diagram for clear representation of relationships

Optimized queries for faster retrieval

Proper normalization for consistency and integrity



---

ER Diagram- link

https://drive.google.com/file/d/14CRx4UpZdC14zn7XBPFxrZ5NQtZfZ9Bl/view?usp=drivesdk

---

Video Demonstration

📹 Watch Project Video (link)

https://drive.google.com/file/d/15vWg6f-AhEZN3uUH5haKmHlImP9oDo7l/view?usp=drivesdk (explained video link)

The video covers:

All functionalities demonstration

Frontend design walkthrough

Backend logic explanation

Database structure & queries overview

Optional Preview Video (No Explanation)
This is an additional, optional video showing only the visual interface and flow of our project, without narration or detailed explanation. It is included so you can quickly experience the look and feel of the website.

link: https://drive.google.com/file/d/1Vnrbd7BauMueJeOKn4hQNVWZEuSXp8Dr/view?usp=drivesdk

---

Tech Stack

Frontend: React + Tailwind CSS

Backend: Node.js, Express, MongoDB

Database: MongoDB

Version Control: Git & GitHub

---
How to Run Locally (MERN)

1. Install Node.js (v18+ recommended) and MongoDB.

2. Open a terminal and install backend dependencies:

   cd backend && npm install

3. Start the backend API:

   cd backend && npm run dev

   Backend will run on http://localhost:5000 by default.

4. In a second terminal, install frontend dependencies and start the React app:

   cd frontend && npm install
   cd frontend && npm run dev

   Frontend will run on http://localhost:5173 by default.

5. Open the frontend URL in your browser and sign up / sign in.


Environment configuration

- Backend uses `backend/.env` for configuration.
  - Set `MONGO_URI`, `JWT_SECRET`, and `ADMIN_STUDENT_ID` (your Student ID for admin access).
  - To enable password reset email, set SMTP variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM`.
  - `FRONTEND_URL` should match the URL where the React app runs (default: `http://localhost:5173`).
- Frontend uses `frontend/.env` (`VITE_API_URL`) to point at the backend API.


Deployment (making it live)

1) **Host the backend**
   - Use a service like **Render**, **Heroku**, **Railway**, or **DigitalOcean App Platform**.
   - Set environment variables from `backend/.env` (Mongo URI, JWT secret, admin ID, SMTP settings).
   - Ensure the backend URL is served over HTTPS.

2) **Host the frontend**
   - Use **Vercel**, **Netlify**, or **Cloudflare Pages**.
   - Point `VITE_API_URL` to your deployed backend URL (e.g., `https://api.example.com/api`).

3) **MongoDB**
   - Use **MongoDB Atlas** (free tier) for production storage.
   - Update `MONGO_URI` accordingly.

4) **Email (optional, for password reset)**
   - Use a transactional email provider (SendGrid, Mailgun, SMTP from your hosting).
   - Configure SMTP variables in the backend environment.

5) **Real-time updates**
   - The app uses Socket.IO for real-time updates.
   - Ensure the backend host allows WebSocket connections and the frontend is configured with the correct backend URL.

---

License

This project is created for academic purposes and is not intended for commercial use.
