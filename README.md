
# TradeTalks

TradeTalks is a scalable backend application designed for a chat-based marketplace where users can create nested chats, interact with each other, and seamlessly buy or sell products. Built using **Express.js** with a modular architecture, it offers a clean, organized structure for rapid development and scalability.

---

## Features

- **Nested Chats**: Create and manage chats with hierarchical sub-chats.
- **Marketplace Integration**: Buy and sell products directly within chat threads.
- **Modular Architecture**: Organized structure for easy maintenance and scalability.
- **Middleware Support**: Authentication, error handling, logging, and role-based access control.
- **Real-Time Communication**: Designed to support WebSocket integration for live updates.
- **Robust Database**: Supports PostgreSQL with seed data setup.
- **Caching**: Includes Redis for efficient caching and faster responses.

---

## Project Structure

The project is organized as follows:

```plaintext
thisisby-TradeTalks/
├── Dockerfile
├── docker-compose.local.yaml
├── docker-compose.yaml
├── package.json
├── tsconfig.json
├── .env.docker
├── .gitlab-ci.yml
└── src/
    ├── context.ts
    ├── index.ts
    ├── app/
    │   ├── middlewares/          # Middleware for auth, logging, errors, etc.
    │   ├── modules/              # Feature modules like chat, user, auth, etc.
    │   └── routes/               # Centralized route management
    ├── config/                   # Configuration files for DB, Redis, etc.
    ├── constants/                # App-wide constants
    ├── database/                 # Database connection and seeding
    ├── errors/                   # Custom error handling
    ├── helpers/                  # Utility functions and helpers
    ├── services/                 # Shared services like AWS, image upload, etc.
    └── utils/                    # General utilities
```

---

## Prerequisites

- **Node.js**: v16.17 or later
- **Docker**: v20.10 or later
- **Docker Compose**: v2.2 or later

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/TradeTalks.git
cd TradeTalks
```

### 2. Setup Environment Variables

Create a `.env.docker` file for environment variables. Example:

```plaintext
NODE_ENV=development
DATABASE_URL=postgres://postgres:qweQWE123@localhost:5432/db
REDIS_URL=redis://localhost:6379
```

### 3. Build and Run Services

#### Local Environment

Run the app with the `docker-compose.local.yaml` configuration:

```bash
docker-compose -f docker-compose.local.yaml up
```

#### Production Environment

Use the production configuration:

```bash
docker-compose up --build
```

---

## Endpoints

### Health Check

- **GET** `/health-check`: Check the server health.

### Auth Module

- **POST** `/auth/login`: User login.
- **POST** `/auth/register`: User registration.

### Chat Module

- **POST** `/chat`: Create a new chat.
- **GET** `/chat/:id`: Get details of a specific chat.
- **POST** `/chat/:id/message`: Send a message in a chat.

... and more. See the full API documentation [here](./docs/API.md).

---

## Development

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm start
```

---

## Testing

### Run Tests

```bash
npm test
```

---

## Docker Support

The application includes a `Dockerfile` and `docker-compose` configurations for local and production environments. Services like PostgreSQL and Redis are pre-configured.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
