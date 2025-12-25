# Deployment Guide - Alumni Backend

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation Steps

1. **Clone or extract the repository**
```bash
cd alumni-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

4. **Update `.env` file with your database credentials:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rvce-connect-pro
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

PORT=3000
NODE_ENV=development
```

5. **Start MySQL and create database**
```bash
# Start MySQL (method depends on your installation)
brew services start mysql  # macOS with Homebrew
# OR
sudo systemctl start mysql  # Linux

# Create database
mysql -u root -p
CREATE DATABASE IF NOT EXISTS `rvce-connect-pro` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

6. **Run the server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

7. **Seed sample data (optional)**
```bash
npm run seed
```

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper database credentials
4. Set up process manager (PM2 recommended)

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name alumni-backend
pm2 save
pm2 startup
```

### Docker Deployment (Optional)
Create `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

## API Documentation

Base URL: `http://localhost:3000`

### Authentication Endpoints
- `POST /api/auth/register/alumni` - Register as alumni
- `POST /api/auth/register/admin` - Register as admin
- `POST /api/auth/login/alumni` - Login as alumni
- `POST /api/auth/login/admin` - Login as admin
- `GET /api/auth/me` - Get current user (protected)

### Alumni Endpoints
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/me` - Get my profile
- `GET /api/alumni/:id` - Get alumni by ID
- `PUT /api/alumni/:id` - Update alumni
- `DELETE /api/alumni/:id` - Delete alumni

### Other Endpoints
See README.md for complete API documentation.

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `.env` file

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill process: `lsof -ti:3000 | xargs kill`

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Security Checklist
- [ ] Change default JWT_SECRET
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable request logging
- [ ] Regular security updates

