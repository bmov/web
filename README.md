# bmov.co

## Running the Project

```bash
pnpm install
cp .env.example .env
cp client/.env.example client/.env
pnpm start
```

**Development Mode:**

```bash
pnpm dev
```

**Frontend Development Server:**

```bash
pnpm nuxt:dev
```

The Nuxt development server runs at `http://127.0.0.1:5173`, and `/api` requests are proxied to the backend at `http://127.0.0.1:3000`.

---

## Deployment with Docker Compose

```bash
docker compose up --build -d
```

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
mysql -u root -p notepad < sql/migrations/003_add_posts_metadata.sql
mysql -u root -p notepad < sql/migrations/004_add_contact_messages.sql
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

> Restricted to the logged account.

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
  "content": "This is the **content**."
}
```

> **Note:** The post body is saved and returned with both the raw Markdown (`content`) and the rendered HTML (`contentHtml`). The rendered HTML is sanitized to keep only allowed tags and attributes before saving.

### Get Post List

`GET /api/posts`

Supports pagination using `offset` and `limit` query parameters. The maximum value for `limit` is `50`.

```bash
GET /api/posts?offset=0&limit=20
```

### Get a Single Post

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

### Send Contact Message

`POST /api/contact`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I want to discuss a project."
}
```

### Get Contact Message List

> Restricted to the administrator.

`GET /api/contact`

Supports pagination using `offset` and `limit` query parameters. The maximum value for `limit` is `100`.

```bash
GET /api/contact?offset=0&limit=20
```

### Get a Single Contact Message

> Restricted to the administrator.

`POST /api/contact/:id`

### Upload Image (Admin Only)

> Restricted to the administrator.

`POST /api/images/upload`

Use `multipart/form-data` and pass the image file in the `image` field.

Supported formats: `jpg`, `jpeg`, `png`, `gif`, `webp`  
Max file size: `10MB`

```bash
curl -X POST http://127.0.0.1:3000/api/images/upload \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/cover.webp"
```

Example response:

```json
{
  "image": {
    "year": "2026",
    "month": "07",
    "filename": "cover-1751816820000-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.webp",
    "originalName": "cover.webp",
    "mimeType": "image/webp",
    "size": 123456,
    "url": "/api/images/2026/07/cover-1751816820000-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.webp"
  }
}
```

### Serve Uploaded Image

`GET /api/images/:year/:month/:filename`

```bash
GET /api/images/2026/07/cover-1751816820000-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.webp
```
