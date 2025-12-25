# Alumni Backend API

A comprehensive backend API for managing an alumni database system with features for mentorship, events, job postings, and messaging.

## Features

- **User Management**: Alumni and Admin registration, authentication, and profile management
- **Mentorship System**: Request and manage mentorship relationships between alumni
- **Event Management**: Create, manage, and participate in events
- **Job Postings**: Alumni can post and apply for job opportunities
- **Messaging**: Direct messaging between alumni
- **Admin Verification**: Admin can verify alumni accounts

## Tech Stack

- **Node.js** with Express.js
- **Sequelize** ORM for database management
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd alumni-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=alumni_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

PORT=3000
NODE_ENV=development
```

5. Create the MySQL database:
```sql
CREATE DATABASE alumni_db;
```

6. Run the seed script to populate the database with sample data:
```bash
npm run seed
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register/alumni` - Register as alumni
- `POST /api/auth/register/admin` - Register as admin
- `POST /api/auth/login/alumni` - Login as alumni
- `POST /api/auth/login/admin` - Login as admin
- `GET /api/auth/me` - Get current user (protected)

### Alumni (`/api/alumni`)
- `GET /api/alumni` - Get all alumni (with filters)
- `GET /api/alumni/me` - Get current alumni profile
- `GET /api/alumni/:id` - Get alumni by ID
- `PUT /api/alumni/:id` - Update alumni profile
- `DELETE /api/alumni/:id` - Delete alumni (admin only)

### Admin (`/api/admin`)
- `GET /api/admin` - Get all admins
- `GET /api/admin/:id` - Get admin by ID
- `POST /api/admin/verify-alumni/:id` - Verify alumni
- `POST /api/admin/unverify-alumni/:id` - Unverify alumni
- `GET /api/admin/alumni/unverified` - Get unverified alumni

### Mentorship (`/api/mentorship`)
- `POST /api/mentorship/request` - Request mentorship
- `GET /api/mentorship/my` - Get my mentorships
- `PUT /api/mentorship/:id/status` - Update mentorship status
- `GET /api/mentorship/all` - Get all mentorships (admin only)

### Events (`/api/events`)
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/participate` - Participate in event
- `DELETE /api/events/:id/participate` - Remove participation

### Jobs (`/api/jobs`)
- `GET /api/jobs` - Get all job postings
- `GET /api/jobs/:id` - Get job posting by ID
- `POST /api/jobs` - Create job posting
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/applications/my` - Get my applications
- `PUT /api/jobs/applications/:id/status` - Update application status

### Messages (`/api/messages`)
- `POST /api/messages` - Send message
- `GET /api/messages` - Get my messages
- `GET /api/messages/conversations` - Get conversations list
- `GET /api/messages/unread/count` - Get unread message count
- `PUT /api/messages/:id/read` - Mark message as read

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### Entity Types
- **Alumni**: alumni_id, name, gender, contact, email, year_of_graduation, branch, CGPA, placement, higher_studies, current_field, current_company, experience_years, password_hash, verified, verified_by_admin_id
- **Admin**: admin_id, name, email, password_hash
- **Mentorship**: mentorship_id, mentor_alumni_id, mentee_alumni_id, status
- **Event**: event_id, title, description, date, location, organizer_id, organizer_type
- **Event_Participation**: participation_id, event_id, alumni_id, role
- **Job_Posting**: job_id, posted_by_alumni_id, title, company, location, description, post_date, eligibility, status
- **Job_Application**: application_id, job_id, applicant_alumni_id, apply_date, status
- **Message**: message_id, sender_id, receiver_id, content, timestamp, read_flag

## Sample Data

After running the seed script, you can use these credentials:

- **Admin**: admin@alumni.com / admin123
- **Alumni (verified)**: alumni1@example.com / password123
- **Alumni (verified)**: alumni2@example.com / password123
- **Alumni (unverified)**: alumni3@example.com / password123

## Development

### Project Structure
```
alumni-backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── models/             # Sequelize models
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   └── utils/              # Middleware and utilities
├── scripts/
│   └── seed.js             # Database seeding script
├── .env.example            # Environment variables template
├── package.json
└── README.md
```

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Input validation is performed using express-validator
- CORS is enabled (configure appropriately for production)

## License

ISC

