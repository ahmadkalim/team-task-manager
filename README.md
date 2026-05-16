# Team Task Manager

This project is a full-stack web application designed for team collaboration and task management. It is built using Next.js, Prisma, and NextAuth, featuring a role-based access control system and a custom Apple Liquid Glass design.

## Features

- User Authentication
- Role-based Access Control
- Project Management
- Task Assignment and Tracking
- Custom User Interface

## Setup Instructions

1. Clone the repository to your local machine.
2. Run npm install to install the required dependencies.
3. Apply the database schema by running npx prisma db push.
4. Start the development server using npm run dev.
5. Access the application in your browser at localhost:3000.

## Database Configuration

The application uses SQLite by default for simplified local setup. The Prisma schema is located in the prisma directory. 

## Deployment

This application is ready to be deployed on Railway. You can link your GitHub repository to a new Railway project. Ensure that your environment variables are configured correctly in the deployment environment. The provided railway.toml file will handle the build and start commands automatically.

## Repository Information

Author: ahmadkalims
Contact: ahmadkalim6@gmail.com
