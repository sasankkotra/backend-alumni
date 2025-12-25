# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
# Start MySQL
brew services start mysql  # macOS
# OR
sudo systemctl start mysql  # Linux

# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS \`rvce-connect-pro\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 3: Configure Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env and set your database password if needed
# DB_PASSWORD=your_password
```

### Step 4: Start Server
```bash
npm start
```

### Step 5: Verify
```bash
curl http://localhost:3000/health
# Should return: {"status":"OK","message":"Alumni Backend API is running"}
```

### Step 6: Seed Data (Optional)
```bash
npm run seed
```

## Test the API

### Register an Alumni
```bash
curl -X POST http://localhost:3000/api/auth/register/alumni \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "gender": "Male",
    "contact": "1234567890",
    "year_of_graduation": 2020,
    "branch": "Computer Science"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login/alumni \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Alumni (with token)
```bash
curl http://localhost:3000/api/alumni \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Credentials (After Seeding)

- **Admin**: admin@alumni.com / admin123
- **Alumni**: alumni1@example.com / password123

## Need Help?

- Check `README.md` for detailed documentation
- Check `SETUP.md` for troubleshooting
- Check `DEPLOYMENT.md` for production setup

