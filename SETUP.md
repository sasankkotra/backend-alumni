# Database Setup Guide for Alumni Backend

## Current Configuration

The backend is configured to connect to the MySQL database: **rvce-connect-pro**

## Steps to Run the Backend

### 1. Start MySQL Server

You need to start MySQL before running the backend. Choose one of these methods:

**Option A: Using MySQL Workbench or MySQL Preferences**
- Open MySQL Workbench or System Preferences
- Start the MySQL service

**Option B: Using Command Line (if MySQL is installed via Homebrew)**
```bash
brew services start mysql
```

**Option C: Using MySQL Server directly**
```bash
sudo /usr/local/mysql/support-files/mysql.server start
```

**Option D: If MySQL is part of Anaconda/MAMP/XAMPP**
- Start it through the respective control panel

### 2. Create the Database

Once MySQL is running, create the database:

```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS `rvce-connect-pro` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Or use the setup script:
```bash
./setup-db.sh
```

### 3. Update .env File (if needed)

If your MySQL root user has a password, update the `.env` file:

```env
DB_PASSWORD=your_mysql_password
```

### 4. Start the Backend Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 5. Verify Connection

The server should start on `http://localhost:3000`

Check health endpoint:
```bash
curl http://localhost:3000/health
```

## Troubleshooting

### Error: "ECONNREFUSED" or "Can't connect to MySQL server"
- **Solution**: MySQL is not running. Start MySQL using one of the methods above.

### Error: "Access denied for user"
- **Solution**: Check your MySQL username and password in the `.env` file.

### Error: "Unknown database 'rvce-connect-pro'"
- **Solution**: Create the database using the SQL command above or run `./setup-db.sh`

### Finding MySQL Installation
```bash
which mysql
mysql --version
```

## Database Connection Details

Current settings in `.env`:
- **Host**: localhost
- **Port**: 3306
- **Database**: rvce-connect-pro
- **User**: root
- **Password**: (empty - update if needed)

## Next Steps

After the server starts successfully:
1. The database tables will be created automatically
2. You can seed sample data: `npm run seed`
3. API endpoints will be available at `http://localhost:3000/api/`

