import sqlite3

def run_migration():
    try:
        # Connect to the database
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()

        # Create users table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                username TEXT UNIQUE NOT NULL,
                full_name TEXT,
                hashed_password TEXT NOT NULL,
                daily_steps_goal INTEGER NOT NULL DEFAULT 10000,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Try to add the daily_steps_goal column (this might fail if the column already exists)
        try:
            cursor.execute('''
                ALTER TABLE users 
                ADD COLUMN daily_steps_goal INTEGER NOT NULL DEFAULT 10000
            ''')
            print("Added daily_steps_goal column")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("daily_steps_goal column already exists")
            else:
                raise e

        # Commit the changes
        conn.commit()
        print("Migration successful")

    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        # Close the connection
        conn.close()

if __name__ == "__main__":
    run_migration() 