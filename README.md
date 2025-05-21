# Todo Summary Assistant

A full-stack application for managing todos, generating AI-powered summaries, and sending them to Slack.

## Features
- Create, edit, and delete todo items
- Mark todos as complete
- Generate summaries of pending todos using AI
- Send summaries to Slack

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **AI Integration**: OpenAI
- **Slack Integration**: Incoming Webhooks

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- OpenAI API key
- Slack workspace with Incoming Webhook

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nithin849/todo-summary-assistant.git
   cd todo-summary-assistant
```


2. Setup the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

3. Setup the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables in `backend/.env`:
   DATABASE_URL=nithin_connection_string
   OPENAI_API_KEY=nithin849
   
   PORT=5000

5. Initialize the database:
   - Create a PostgreSQL database
   - Run the SQL script from `backend/db/setup.sql`


### Running the Application
1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd ../frontend
   npm start
   ```

3. Open your browser to `http://localhost:3000`


## Configuration

### Slack Setup
1. Create a Slack Incoming Webhook
2. Add the webhook URL to your `.env` file


### OpenAI Setup
1. Get an API key from OpenAI
2. Add the key to your `.env` file


## Project Structure
```
todo-summary-assistant/
├── frontend/          # React application
├── backend/           # Node.js server
│   ├── services/      # LLM and other services
│   ├── db/           # Database setup
│   └── server.js     # Main server file
├── .env.example      # Environment variables template
└── README.md         # This file
```


## Contact
For any questions or support, please contact:
- GitHub: [LinkOfProject](https://github.com/nithin849/todo-summary-assistant)
- Email: [clickHereToMsg](mailto:mnithinmangali@gmail.com)
