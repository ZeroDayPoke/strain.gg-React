#!/usr/bin/env bash

# Function to safely load .env variables
load_env() {
    set -a
    source .env
    set +a
}

# Function to manage database-related variables in .env
manage_db_env() {
    db_vars=("DB_USER" "DB_PASS" "DB_NAME")
    for var in "${db_vars[@]}"; do
        grep -q "^$var=" .env || {
            read -p "$var: " value
            echo "$var=$value" >>.env
        }
    done
}

# Functions to manage database
execute_sql() {
    local sql=$1
    sudo mysql -e "$sql" || {
        echo "Failed to execute: $sql"
        exit 1
    }
}

drop_database() {
    local db=$1
    local user=$2
    echo "Dropping database $db and removing associated user $user..."
    execute_sql "DROP DATABASE IF EXISTS $db;"
    execute_sql "DROP USER IF EXISTS '$user'@'localhost';"
    execute_sql "FLUSH PRIVILEGES;"
}

create_database() {
    local db=$1
    local user=$2
    local pass=$3
    echo "Creating database $db..."
    execute_sql "CREATE DATABASE IF NOT EXISTS $db;"
    execute_sql "CREATE USER IF NOT EXISTS '$user'@'localhost' IDENTIFIED BY '$pass';"
    execute_sql "GRANT ALL PRIVILEGES ON $db.* TO '$user'@'localhost';"
    execute_sql "FLUSH PRIVILEGES;"
}

# Load and manage .env
[ -f .env ] && load_env
manage_db_env
[ -f .env ] && load_env

read -p "Do you want to drop existing databases? (y/N): " DROP_DB
action="Creating"

if [ "$DROP_DB" = "y" ] || [ "$DROP_DB" = "Y" ]; then
    action="Recreating"
    drop_database "$DB_NAME"
    drop_database "${DB_NAME}_dev"
    drop_database "${DB_NAME}_test"
fi

# Create databases
create_database "$DB_NAME" "$DB_USER" "$DB_PASS"
create_database "${DB_NAME}_dev" "$DB_USER" "$DB_PASS"
create_database "${DB_NAME}_test" "$DB_USER" "$DB_PASS"

echo "Databases managed successfully."
