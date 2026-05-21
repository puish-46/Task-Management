# TaskFlow Backend API 

The secure REST API engine powering TaskFlow. Features robust role-based access control, cookie-based token validation, database seed control, and secure JSON communication.

###  Live Base API URL
* [https://task-management-bjik.onrender.com](https://task-management-bjik.onrender.com)

---

##  Security & Authentication Architecture

* **JWT Cookies**: Employs industry-standard JSON Web Tokens stored via secure `httpOnly`, `sameSite: "none"`, and `secure: true` cookies.
* **Role Verification Middleware**: `verifyToken("ADMIN", "USER")` checks both login validity and privilege levels on a route-by-route basis.
* **Robust CORS**: Custom dynamic origin checks that strip trailing slashes, supporting both development and production client origins smoothly.

---

##  API Endpoints Summary

###  Authentication (`/auth`)
* `POST /auth/users` — Public account registration (enforces `USER` role).
* `POST /auth/login` — User/Admin login (validates active status, sets HTTP-only cookie).
* `GET /auth/logout` — Destroys current auth cookie session.

###  User Management (`/user-api` — Admin Only)
* `GET /user-api/users` — Fetch all registered users.
* `PUT /user-api/users/status/:userId` — Toggle target account status (Active / Inactive).
* `DELETE /user-api/users/:userId` — Permanently delete a user account and their associated data.

###  Task Actions (`/task-api`)
* `GET /task-api/tasks` — Fetch tasks list (Admins get all; Users get their own tasks).
* `POST /task-api/tasks` — Create task (Admins assign to anyone; Users are auto-assigned to self).
* `PUT /task-api/tasks/:taskId` — Edit task details (Admin only).
* `PUT /task-api/tasks/status/:taskId` — Update completion status (Admins and assigned Users).
* `DELETE /task-api/tasks/:taskId` — Delete task (Admins can delete any task; Users can only delete their own).

---

##  Running Locally

Ensure MongoDB is active on your machine.

```bash
# Install dependencies
npm install

# Run backend API
npm run dev # or nodemon server.js
```
