import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page/Home";
import Shop from "./page/Shop";
import Seller from "./page/Seller";
import Admin from "./page/Admin";
import AppLayout from "./Components/AppLayout";
import ErrorPage from "./page/ErrorPage";
import AuthCallback from "./Components/AuthCallback";
import ProductDetail from "./page/ProductDetail";
import StoreDetail from "./page/StoreDetail";
import Cart from "./page/Cart";
import Orders from "./page/Orders";

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
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/seller",
        element: <Seller />,
      },
      {
        path: "/store/:vendorId",
        element: <StoreDetail />,
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
