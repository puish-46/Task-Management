import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />,
        },
        {
          path: "home",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
  ]);

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(30, 41, 59, 0.9)",
            color: "#e2e8f0",
            borderRadius: "12px",
            border: "1px solid rgba(148, 163, 184, 0.12)",
            backdropFilter: "blur(12px)",
            fontSize: "0.875rem",
            fontFamily: "Inter, sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#14b8a6",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;