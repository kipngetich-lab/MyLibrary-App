# MyLibrary-App

A full-stack library management application (backend + frontend) with user authentication, book management, lending/returns, reservations, admin/librarian dashboard, reports/analytics

This README explains the project structure, setup, environment variables, running the app, important API endpoints, and notes about the dashboard and recent-activity features.

## Table of Contents

1. Project overview
2. Features
3. Tech stack
4. Prerequisites
5. Environment variables
6. Installation & setup

		i.Backend
		ii.Frontend
7. Running the app
8. API summary (important routes)
9. Authentication
10. Dashboard: recent borrows / returns / reservations
11. Reports & trends data
12. Deployment notes
13. Contributing
14. License
15. Contact

### Project overview

MyLibrary is a library management system intended for small to medium libraries. It provides:

- User authentication (register/login) and role-based access (admin, librarian, member)
- Book CRUD and catalog (OPAC)
- Lending and returns management
- Reservations
- Admin/Librarian dashboard showing recent activity
- Reports and analytics (trends data)

### Features

- Role-based UI and permissions (admin, librarian, member)
- Borrow (lend) and Return flows with status tracking
- Reservations queue for books
- Recent activity panel in the dashboard: recent borrows, recent returns, recent reservations
- Simple reports/trends JSON for charts

### Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (React Router)
- Authentication: JWT
- Email: nodemailer (or any mail provider)
- Styling: Tailwind CSS (optional)
- Optional: dotenv for env variables

### Prerequisites

- Node.js >= 12.22.12
- npm or yarn
- MongoDB (local or hosted)
- (Optional) SMTP credentials for sending emails

### Environment variables

Create a .env file in the backend root with at least:

- PORT=5000 
- MONGO_URI=mongodb://localhost:27017/mylibrary 
- JWT_SECRET=your_jwt_secret 
- JWT_EXPIRES_IN=7d 
- CLIENT_URL=http://localhost:3000 
- EMAIL_HOST=smtp.example.com 
- EMAIL_PORT=587 
- EMAIL_USER=your_email_user 
- EMAIL_PASS=your_email_password 
- EMAIL_FROM="MyLibrary no-reply@yourdomain.com"

Adjust values for production.

### Installation & setup

Backend

```bash
git clone https://github.com/kipngetich-lab/MyLibrary-App.git
```
- cd server
- npm install
- Create .env (see above)
- Start MongoDB
- Start server:

        - Development: npm run dev (using nodemon)
        - Production: npm start

Frontend

- cd client
- npm install
- Start frontend:

        - npm run dev

### Running the app

- Start backend (default: http://localhost:5000)
- Start frontend (default: http://localhost:3000)
- Register or seed an admin/librarian user, login and use the dashboard

### API summary (important routes)

All API routes are prefixed with /api. 

Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protected)

Books

- GET /api/books
- GET /api/books/:id
- POST /api/books (admin/librarian)
- PUT /api/books/:id
- DELETE /api/books/:id

Lending (loans)

- GET /api/lend

Returns loans; can be filtered server-side. Example fields: { status: 'active' | 'returned', issueDate, returnDate, member, book }
- POST /api/lend (create loan)
- PUT /api/lend/:id/return (mark returned)

Reservations

- GET /api/reservations
- POST /api/reservations
- DELETE /api/reservations/:id

Reports / Trends

- GET /api/reports/trends

Returns JSON used by analytics charts

### Contributing

Contributions are welcome! Please fork the repo and create a pull request with your improvements.

### License

MIT License 

### Contact
	
For questions or support, reach me at joskipngetich07@gmail.com












