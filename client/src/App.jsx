import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home";
import Shop from "./page/Shop";
import Seller from "./page/Seller";
import Admin from "./page/Admin";
import AppLayout from "./Components/AppLayout";
import ErrorPage from "./page/ErrorPage";
import AuthCallback from "./Components/AuthCallback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/seller",
        element: <Seller />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/auth/callback",
        element: <AuthCallback />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
