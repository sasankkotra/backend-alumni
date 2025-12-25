#!/bin/bash

echo "Setting up database for Alumni Backend..."
echo ""

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL is not running. Please start MySQL first:"
    echo "   - macOS: brew services start mysql"
    echo "   - Or: sudo /usr/local/mysql/support-files/mysql.server start"
    echo "   - Or use MySQL Workbench/Sequel Pro to start the service"
    echo ""
    exit 1
fi

# Get database credentials from .env or use defaults
DB_NAME="rvce-connect-pro"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"

echo "Creating database: $DB_NAME"
if [ -z "$DB_PASSWORD" ]; then
    mysql -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
else
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
fi

if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created successfully!"
    echo ""
    echo "You can now start the server with: npm start"
else
    echo "❌ Failed to create database. Please check:"
    echo "   1. MySQL is running"
    echo "   2. Database credentials in .env file are correct"
    echo "   3. You have permission to create databases"
fi

