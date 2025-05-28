-- Add daily_steps_goal column to users table
ALTER TABLE users ADD COLUMN daily_steps_goal INTEGER NOT NULL DEFAULT 10000; 