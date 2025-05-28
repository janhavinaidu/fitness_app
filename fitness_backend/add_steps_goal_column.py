import sqlite3

def setup_database():
    try:
        # Connect to the database
        conn = sqlite3.connect('sql_app.db')
        cursor = conn.cursor()

        # Create users table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR UNIQUE,
                username VARCHAR UNIQUE,
                full_name VARCHAR,
                hashed_password VARCHAR,
                daily_steps_goal INTEGER DEFAULT 10000 NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Commit the changes and close the connection
        conn.commit()
        print("Successfully set up the database")
    except sqlite3.Error as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    setup_database() 