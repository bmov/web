# Simple Web Notepad

A web notepad application built with Express.js + MySQL 8.x and Vue 3 frontend.

## Running the Project

```bash
pnpm install
cp .env.example .env
pnpm start
```

**Development Mode:**

```bash
pnpm dev
```

**Frontend Development Server:**

```bash
pnpm client:dev
```

The Vue development server runs at `http://127.0.0.1:5173`, and `/api` requests are proxied to the backend at `http://127.0.0.1:3000`.

---

## Deployment with Docker Compose

```bash
docker compose up --build
```

The application will run at `http://127.0.0.1:3000`. Before deploying to production, make sure to change the `JWT_SECRET`, database passwords, and `ADMIN_EMAILS` in `docker-compose.yml`.

The default address is `http://127.0.0.1:3000`. If needed, you can modify `HOST` and `PORT` in the `.env` file.

---

## Database Setup

Execute `sql/schema.sql` in MySQL.

```bash
mysql -u root -p < sql/schema.sql
```

If you have already created the existing schema, run the additional migrations:

```bash
mysql -u root -p notepad < sql/migrations/001_add_posts_content_html.sql
mysql -u root -p notepad < sql/migrations/002_add_posts_is_pinned.sql
```

---

## Environment Variables

* `ADMIN_EMAILS`: A list of administrator emails. You can specify multiple emails separated by commas.
* `SIGNUP_ENABLED`: If set to `false`, the signup API will return a `403` error.
* `JWT_SECRET`: Must be set to a long, random string in production environments.

---

## API Endpoints

Endpoints that require authentication expect the `Authorization: Bearer <token>` header.

### Sign Up

`POST /api/auth/signup`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User"
}
```

### Log In

`POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create a Post

> Restricted to the logged account.

`POST /api/posts`

```json
{
  "title": "First Post",
  "content": "This is the [b]content[/b]."
}
```

> **Note:** The post body is saved and returned with both the raw BBCode (`content`) and the rendered HTML (`contentHtml`). The rendered HTML is sanitized to keep only allowed tags and attributes before saving.

### Get Post List

> Restricted to the logged account.

`GET /api/posts`

Supports pagination using `offset` and `limit` query parameters. The maximum value for `limit` is `50`.

```bash
GET /api/posts?offset=0&limit=20
```

### Get a Single Post

> Restricted to the logged account.

`GET /api/posts/:id`

### Update a Post

> Restricted to the author or an administrator.

`PATCH /api/posts/:id`

```json
{
  "title": "Updated Title",
  "content": "[i]Updated content[/i]"
}
```

### Pin a Post

> Restricted to the administrator.

Pinned posts are displayed at the top of the post list.

`PATCH /api/posts/:id/pin`

```json
{
  "isPinned": true
}
```

### Delete a Post

> Restricted to the author or an administrator.

`DELETE /api/posts/:id`
