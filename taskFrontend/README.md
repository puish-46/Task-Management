# TaskFlow Frontend 

The user interface of TaskFlow is a high-fidelity, interactive, dark-themed dashboard styled using clean glassmorphism techniques (`backdrop-filter: blur`).

###  Live URL
* [https://task-management-liart-ten.vercel.app](https://task-management-liart-ten.vercel.app)

---

##  Tech Stack & Key Libraries

* **React (Vite)**: Quick hot-reloads and ultra-fast production bundle sizes.
* **Zustand**: Fast, scalable, and ultra-lightweight global state management for auth session and tasks array.
* **Axios**: Configured with `withCredentials: true` to support HTTP-Only cookies.
* **React Hot Toast**: Beautiful micro-notifications for user feedback on API actions.
* **Lucide Icons / Custom SVG**: Sleek UI vector elements.

---

##  CSS Styling Decisions (index.css)

All page layouts are governed by a robust, unified styling pattern in `index.css`:
* **Glassmorphic Cards**: `background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08);`
* **Vibrant HSL Gradients**: Used for badges, custom buttons, and page headings (`#14b8a6` to `#06b6d4`).
* **Input Field Overrides**: Custom autocompletion colors and glowing border focuses that blend into the dark theme.

---

##  Environment Configuration

For development or production build, configure the API target inside `.env.local`:
```env
VITE_API_URL=https://task-management-bjik.onrender.com
```

---

##  Running Locally

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Build for production
npm run build
```
