# Knowledge Portal

Knowledge Portal is a role-based document management platform built with Laravel 10 and React 18. It exposes a JWT-secured REST API and a single page application admin panel bundled in the same Laravel codebase via Vite.

## Requirements

- PHP 8.1+
- Composer
- Node.js 18+
- npm or yarn
- MySQL (or SQLite) database server

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure your database credentials inside `.env` and then run the migrations and seeders:

```bash
php artisan migrate --seed
php artisan storage:link
```

Install and run the frontend assets:

```bash
npm install
npm run dev
```

Finally, boot the Laravel development server:

```bash
php artisan serve
```

The API will be available under `http://127.0.0.1:8000/api` and the React SPA will be served at `http://127.0.0.1:8000` through the catch-all web route.

### Default Credentials

- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `admin`

## Features

- JWT authentication powered by `php-open-source-saver/jwt-auth`
- Role-based authorization middleware (`admin`, `knowledge_manager`, `employee`)
- Document CRUD with file storage, tagging, and role access mapping
- REST API resources for users, roles, and documents
- React admin panel with authentication context, protected routes, and document management workflows
