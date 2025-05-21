-- Create todos table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data
INSERT INTO todos (text, completed) VALUES 
('Complete the internship assignment', false),
('Prepare for the meeting tomorrow', false),
('Buy groceries', true);
