# Bookmark Manager

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933)
![NestJS](https://img.shields.io/badge/NestJS-9.x-E0234E)
![Prisma](https://img.shields.io/badge/Prisma-4.x-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-336791)

Bookmark Manager is a compact backend service for saving, organizing, and retrieving bookmarks with account-based access. It combines authentication, secure bookmark management, and reliable data storage in a simple NestJS API.

## What it offers

- Secure sign up and sign in with JWT-based authentication
- Create, read, update, and delete bookmarks for each user
- PostgreSQL persistence with Prisma ORM
- Local development support through Docker Compose
- Test coverage for core application behavior

## Tech stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker Compose

## Project structure

- server/ — NestJS API application
- server/prisma/ — Prisma schema and migrations

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- Docker Desktop

### Install dependencies

```bash
cd server
npm install
```

### Configure environment variables

Create a `.env` file in the `server` directory with values such as:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/booky?schema=public
JWT_SECRET=change-me
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRESS_DB=booky
POSTGRESS_TESTDB=booky_test
```

### Start the database

```bash
cd server
docker compose up booky-db -d
```

### Run database migrations

```bash
npx prisma migrate deploy
```

### Start the development server

```bash
npm run start:dev
```

## API overview

### Authentication

- `POST /auth/signup`
- `POST /auth/signin`

### Bookmarks

- `GET /bookmarks`
- `GET /bookmarks/:id`
- `POST /bookmarks`
- `PATCH /bookmarks/:id`
- `DELETE /bookmarks/:id`

## Testing

Run the automated test suite with:

```bash
npm run test
npm run test:e2e
```

## License

This project is currently unlicensed.
