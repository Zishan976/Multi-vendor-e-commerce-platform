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
import VendorRegister from "./page/VendorRegister";
import PaymentPage from "./page/PaymentPage";
import PaymentCallback from "./page/PaymentCallback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/shop", element: <Shop /> },
      { path: "/cart", element: <Cart /> },
      { path: "/orders", element: <Orders /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/seller", element: <Seller /> },
      { path: "/store/:vendorId", element: <StoreDetail /> },
      { path: "/admin", element: <Admin /> },
      { path: "/auth/callback", element: <AuthCallback /> },
      { path: "/vendor/register", element: <VendorRegister /> },
      { path: "/payment", element: <PaymentPage /> },
      { path: "/payment/:method", element: <PaymentPage /> },
      { path: "/payment/callback", element: <PaymentCallback /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
