# Kinsley Law Advocates

This is a law firm website for Kinsley Law Advocates. The project consists of a React frontend and a Ruby on Rails backend.

## Project Structure

- `frontend/` - React 19.1.0 frontend application
- `backend/` - Ruby on Rails 8.0.1 API

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

### Backend Setup

```bash
cd backend
bundle install
rails db:create
rails db:migrate
rails db:seed
rails server
```

The API will be available at http://localhost:3000/api/v1

## Development

- Frontend and backend can be developed independently
- The frontend makes API calls to the backend
- You can run both servers simultaneously on different ports

## Features

- Home page with services overview
- About page with attorney profiles
- Services page with detailed practice areas
- Contact form
- Appointment scheduling

## Deployment

TBD