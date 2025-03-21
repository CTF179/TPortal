# TPortal

A finance manager's best friend

## Overview

This application is built using Node.js and Express.js, with a structured
architecture that includes authentication, ticket management, and user
management. It ensures secure access control with authentication and
authorization middleware.

Demo Video: [TPortal V1.0.0](https://youtu.be/lyqFVm-O3PY)

## Features

- User Authentication (Login/Signup)
- Role-based Authorization (Employee, Manager)
- Ticket Management System
- User Management for Admins
- Logging Middleware for Requests and Responses

## Installation

### Prerequisites

Ensure you have the following installed:
- Node.js (v20+ required)
- npm or yarn

# Setup

## Clone the repository

``` bash
git clone https://github.com/CTF179/TPortal.git
cd Tportal

```
## Create Environment Variables
``` bash
touch .env
```
Please fill in the following values.
``` bash
PORT=3000 #<Your-Port>
HOST=127.0.0.1 #<Your-Host-address>
SECRET=1234567890 #<Your-super-secret-key>

```
## Install dependencies
``` powershell 
    npm install
```

## Start the application

``` powershell 
    npm start
```

# API Routes

### Authentication

- POST `/login` - Authenticate users
- POST `/register` - Register a new user

### Ticket Management (Requires Authentication & Authorization)

- GET `/ticket` - Get all tickets (Roles: Employee, Manager)
- GET `/ticket/:id` - Get a specific ticket (Roles: Employee, Manager)
- POST `/ticket` - Create a ticket (Roles: Employee, Manager)

### User Management (Requires Manager Role)

- GET `/users` - Get all users
- PUT `/users/:id` - Update a user

### Middleware

- `authentication` - Validates user session
- `authorization(roles)` - Restricts access based on user role
- `requestMiddleware` - Logs request data
- `responseMiddleware` - Logs response data

# Contributing

Contributions are welcome! Please submit a pull request or open an issue.

# License

This project is licensed under the MIT License.
