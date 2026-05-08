# Internships System API

A Node.js/Express + MongoDB REST API for managing university internships. It supports two roles:

- **Student** — registers, browses recommended internships matching their major/GPA, and applies to up to 3 internships ranked by wish order.
- **Company** — registers, creates internships (max 3 per major), and views ranked applications for an internship.

---

## Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express 5
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (access + refresh tokens) stored in `httpOnly` cookies
- **Password Hashing:** bcrypt

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/internships
JWT_SECRET=your_jwt_secret_key
```

### 3. Run

```bash
npm start
```

Server runs on **http://localhost:3005**.

---

## Authentication

After a successful `POST /api/v1/users/login`, two cookies are set:

| Cookie         | Lifetime | Purpose                               |
| -------------- | -------- | ------------------------------------- |
| `accessToken`  | 15 min   | Sent with every protected request     |
| `refreshToken` | 7 days   | Used to obtain a new `accessToken`    |

Both cookies are `httpOnly`. When testing with Postman, enable "Send cookies" / use the cookie jar so the cookies are returned automatically. With `curl`, use `-c cookies.txt` after login and `-b cookies.txt` on subsequent requests.

Role-protected endpoints additionally enforce `role === "student"` or `role === "company"` from the decoded JWT payload.

---

## Base URL

```
http://localhost:3005/api/v1
```

---

## Endpoints

### Users / Auth — `/api/v1/users`

#### 1. Register

`POST /api/v1/users/register` — **Public**

Creates a `User` plus a role-specific profile (`Student` or `Company`).

**Body — Student:**

```json
{
  "email": "ali@example.com",
  "password": "secret123",
  "role": "student",
  "name": "Ali Hassan",
  "nationalId": "29812345678901",
  "city": "Cairo",
  "gpa": 3.6,
  "major": "CS",
  "bio": "CS senior interested in backend development."
}
```

**Body — Company:**

```json
{
  "email": "hr@acme.com",
  "password": "secret123",
  "role": "company",
  "companyName": "Acme Corp",
  "city": "Cairo"
}
```

**Notes:**

- `role` must be `"student"` or `"company"`.
- `password` must be at least 6 characters.
- `nationalId` must be exactly 14 digits (students).
- `major` ∈ `["CS", "AI", "IS", "SE", "IT"]`.
- `gpa` ∈ `[0, 4]`.

**Success `201`:**

```json
{ "message": "User created successfully" }
```

---

#### 2. Login

`POST /api/v1/users/login` — **Public**

**Body:**

```json
{
  "email": "ali@example.com",
  "password": "secret123"
}
```

**Success `200`:** Sets `accessToken` and `refreshToken` cookies and returns:

```json
{
  "message": "Login successful",
  "user": {
    "id": "65f0...",
    "email": "ali@example.com",
    "role": "student"
  }
}
```

---

#### 3. Refresh Access Token

`POST /api/v1/users/refresh` — **Public** (requires `refreshToken` cookie)

**Body:** _none_

**Success `200`:**

```json
{ "accessToken": "eyJhbGciOi..." }
```

---

#### 4. Logout

`POST /api/v1/users/logout` — **Public**

**Body:** _none_

Clears `accessToken` and `refreshToken` cookies.

**Success `200`:**

```json
{ "message": "Logout successful" }
```

---

### Internships — `/api/v1/internships`

#### 5. Create Internship

`POST /api/v1/internships/` — **Auth required, role: `company`**

A company can create at most **3 internships per major**.

**Body:**

```json
{
  "title": "Backend Engineering Intern",
  "major": "CS",
  "requiredGPA": 3.0,
  "city": "Cairo"
}
```

**Success `201`:**

```json
{
  "message": "Internship created successfully",
  "data": {
    "_id": "65f1...",
    "company": "65f0...",
    "title": "Backend Engineering Intern",
    "major": "CS",
    "requiredGPA": 3,
    "city": "Cairo",
    "createdAt": "2026-05-08T17:00:00.000Z",
    "updatedAt": "2026-05-08T17:00:00.000Z"
  }
}
```

---

#### 6. Get Recommended Internships (for Student)

`GET /api/v1/internships/` — **Auth required, role: `student`**

Returns internships matching the logged-in student's `major` and where `requiredGPA <= student.gpa`.

**Body:** _none_

**Success `200`:**

```json
[
  {
    "_id": "65f1...",
    "company": { "_id": "65f0...", "companyName": "Acme Corp", "city": "Cairo" },
    "title": "Backend Engineering Intern",
    "major": "CS",
    "requiredGPA": 3,
    "city": "Cairo"
  }
]
```

---

#### 7. Get Ranked Applications for an Internship

`GET /api/v1/internships/applications` — **Auth required, role: `company`**

Returns applicants for one of the company's internships, ranked by:

```
finalScore = (4 - wishOrder) * 20  +  gpa * 10
```

**Body:**

```json
{
  "internshipId": "65f1abc1234567890abcdef0"
}
```

> Note: although this is a `GET`, the controller reads `internshipId` from `req.body`. If your client strips bodies on `GET`, change to `POST` or pass it as a query param.

**Success `200`:**

```json
[
  {
    "rank": 1,
    "applicationId": "65f2...",
    "studentId": "65f0...",
    "studentName": "Ali Hassan",
    "major": "CS",
    "gpa": 3.8,
    "wishOrder": 1,
    "finalScore": 98
  },
  {
    "rank": 2,
    "applicationId": "65f3...",
    "studentId": "65f0...",
    "studentName": "Sara Adel",
    "major": "CS",
    "gpa": 3.5,
    "wishOrder": 2,
    "finalScore": 75
  }
]
```

---

### Applications — `/api/v1/applications`

#### 8. Apply to an Internship

`POST /api/v1/applications/` — **Auth required, role: `student`**

Rules enforced server-side:

- Student's `major` must match the internship's `major`.
- `wishOrder` ∈ `{1, 2, 3}`.
- A student can submit at most **3 applications**.
- A `wishOrder` can only be used once per student.
- A student cannot apply to the same internship twice.

**Body:**

```json
{
  "internshipId": "65f1abc1234567890abcdef0",
  "wishOrder": 1
}
```

**Success `201`:**

```json
{
  "message": "Application created successfully",
  "data": {
    "_id": "65f2...",
    "student": "65f0...",
    "internship": "65f1...",
    "status": "pending",
    "wishOrder": 1,
    "createdAt": "2026-05-08T17:05:00.000Z",
    "updatedAt": "2026-05-08T17:05:00.000Z"
  }
}
```

---

## Error Responses

Errors are returned as JSON with an appropriate HTTP status code:

```json
{ "message": "Email already exists" }
```

Common codes:

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 400  | Bad request / validation / business-rule violation           |
| 401  | Missing or invalid token / invalid login credentials         |
| 403  | Authenticated but role is not allowed for this endpoint      |

---

## Project Structure

```
.
├── app.js                  # Express app entrypoint
├── db/connect.js           # Mongoose connection
├── routes/                 # Express routers
│   ├── User/user.js
│   ├── Internship/internship.js
│   └── Application/application.js
├── controllers/            # HTTP layer (req/res)
├── services/               # Business logic
├── repositories/           # Mongoose data access
├── models/                 # Mongoose schemas (User, Student, Company, Internship, Application)
├── middleware/auth.js      # authMiddleware + allowRoles
└── utils/                  # jwt + ranking helpers
```

---

## Quick `curl` Walkthrough

```bash
# 1. Register a student
curl -X POST http://localhost:3005/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ali@example.com","password":"secret123","role":"student","name":"Ali","nationalId":"29812345678901","city":"Cairo","gpa":3.6,"major":"CS","bio":"hi"}'

# 2. Login (saves cookies)
curl -X POST http://localhost:3005/api/v1/users/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"ali@example.com","password":"secret123"}'

# 3. Get recommended internships (uses cookies)
curl http://localhost:3005/api/v1/internships/ -b cookies.txt

# 4. Apply
curl -X POST http://localhost:3005/api/v1/applications/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"internshipId":"<INTERNSHIP_ID>","wishOrder":1}'
```
