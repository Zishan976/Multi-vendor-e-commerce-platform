# 🛒 Multi-Vendor E-Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express.js-green?style=for-the-badge&logo=node.js" alt="Backend">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="Frontend">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql" alt="Database">
  <img src="https://img.shields.io/badge/Tailwind-CSS-blueviolet?style=for-the-badge&logo=tailwind-css" alt="Styling">
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-yellow?style=for-the-badge&logo=vite" alt="Build">
</p>

A full-featured multi-vendor e-commerce platform built with the MERN/PERN stack. This application enables multiple vendors to manage their own stores and products while providing customers with a seamless shopping experience. The platform includes robust admin controls, vendor management, shopping cart, order processing, and multiple payment options.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **Social Login**: Google OAuth 2.0 integration for quick account creation
- **Role-Based Access Control**: Three distinct roles - User, Vendor, and Admin
- **Session Management**: Secure HTTP-only cookies with configurable expiration

### 🏪 Vendor Management

- **Vendor Registration**: Business registration with approval workflow
- **Vendor Dashboard**: Track sales, orders, and product performance
- **Product Management**: Create, update, and manage product listings with images
- **Store Profiles**: Customizable vendor store pages with business information

### 🛍️ Shopping Experience

- **Product Catalog**: Browse products by category with filtering and search
- **Shopping Cart**: Persistent cart with quantity management
- **Wishlist**: Save favorite products for later
- **Product Details**: Detailed product pages with images and descriptions
- **Coupons & Discounts**: Apply promotional codes at checkout

### 💳 Payment System

- **Multiple Payment Methods**: Support for bKash, Nagad, Rocket, Cash on Delivery, and Card payments
- **Secure Payment Processing**: Integration-ready payment gateway
- **Order Tracking**: Real-time order status updates

### 👨‍💼 Admin Dashboard

- **User Management**: View and manage platform users
- **Vendor Approval**: Review and approve vendor applications
- **Category Management**: Create and manage product categories
- **Coupon Management**: Create and track promotional coupons
- **Analytics**: Dashboard statistics and metrics

---

## 🛠️ Technology Stack

### Backend

| Technology  | Purpose                |
| ----------- | ---------------------- |
| Node.js     | Runtime environment    |
| Express.js  | Web framework          |
| PostgreSQL  | Relational database    |
| JWT         | Authentication tokens  |
| Passport.js | Google OAuth strategy  |
| bcryptjs    | Password hashing       |
| Nodemailer  | Email notifications    |
| Cloudinary  | Image upload & storage |
| Multer      | File upload handling   |

### Frontend

| Technology      | Purpose             |
| --------------- | ------------------- |
| React 19        | UI framework        |
| Redux Toolkit   | State management    |
| React Router    | Client-side routing |
| Tailwind CSS    | Styling             |
| Vite            | Build tool          |
| Axios           | HTTP client         |
| Lucide React    | Icon library        |
| React Hot Toast | Notifications       |

---

## 📁 Project Structure

```
Multi-Vendor E-Commerce Platform/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── Components/        # Reusable UI components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   └── ...
│   │   ├── page/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── ...
│   │   ├── store/             # Redux store configuration
│   │   │   └── slices/       # Redux slices
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       └── productsSlice.js
│   │   └── utils/             # Utility functions
│   └── package.json
│
├── config/                    # Configuration files
│   ├── db.js                 # Database connection
│   ├── emailConfig.js        # Email service setup
│   └── schema.sql            # Database schema
│
├── controllers/               # Request handlers
│   ├── authUserController.js
│   ├── vendorController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── adminController.js
│   └── ...
│
├── middleware/               # Express middleware
│   ├── authMiddleware.js    # JWT authentication
│   ├── authVendorMiddleware.js
│   ├── authAdminMiddleware.js
│   ├── passportMiddleware.js
│   └── uploadMiddleware.js
│
├── routes/                   # API route definitions
│   ├── authUserRouter.js
│   ├── vendorRouter.js
│   ├── productRouter.js
│   ├── orderRouter.js
│   ├── cartRouter.js
│   ├── paymentRouter.js
│   ├── adminRouter.js
│   └── couponRouter.js
│
├── utils/                   # Utility services
│   ├── cloudinaryService.js
│   └── notificationService.js
│
├── uploads/                 # Uploaded files
│   └── products/
│
├── index.js                 # Application entry point
├── package.json             # Backend dependencies
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Configuration
SESSION_SECRET=your_session_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Installation Steps

1. **Clone the repository**

```
bash
   git clone <repository-url>
   cd Multi-Vendor-E-Commerce-Platform

```

2. **Install backend dependencies**

```
bash
   npm install

```

3. **Install frontend dependencies**

```
bash
   cd client
   npm install

```

4. **Set up the database**
   - Create a PostgreSQL database named `ecommerce`
   - Run the schema file to create tables:

```
bash
   psql -U postgres -d ecommerce -f config/schema.sql

```

5. **Start the development server**

   For development with both frontend and backend:

```
bash
   npm run dev

```

Or run them separately:

**Backend (Terminal 1):**

```
bash
   npm run dev

```

**Frontend (Terminal 2):**

```
bash
   cd client && npm run dev

```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/auth/register`        | Register new user     |
| POST   | `/api/auth/login`           | User login            |
| POST   | `/api/auth/logout`          | User logout           |
| GET    | `/api/auth/google`          | Google OAuth init     |
| GET    | `/api/auth/google/callback` | Google OAuth callback |
| POST   | `/api/auth/refresh-token`   | Refresh access token  |

### Products

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/products`     | Get all products        |
| GET    | `/api/products/:id` | Get product details     |
| POST   | `/api/products`     | Create product (vendor) |
| PUT    | `/api/products/:id` | Update product (vendor) |
| DELETE | `/api/products/:id` | Delete product (vendor) |

### Categories

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/categories`     | Get all categories      |
| POST   | `/api/categories`     | Create category (admin) |
| PUT    | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Cart

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/cart`            | Get user cart    |
| POST   | `/api/cart/add`        | Add item to cart |
| PUT    | `/api/cart/update/:id` | Update cart item |
| DELETE | `/api/cart/remove/:id` | Remove cart item |

### Orders

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/orders`            | Get user orders     |
| POST   | `/api/orders`            | Create new order    |
| GET    | `/api/orders/:id`        | Get order details   |
| PUT    | `/api/orders/:id/status` | Update order status |

### Payments

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| POST   | `/api/payments/initiate` | Initiate payment |
| POST   | `/api/payments/callback` | Payment callback |

### Coupons

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/api/coupons`          | Get all coupons       |
| POST   | `/api/coupons`          | Create coupon (admin) |
| POST   | `/api/coupons/validate` | Validate coupon       |

### Vendor

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| POST   | `/api/vendor/register` | Vendor registration   |
| GET    | `/api/vendor/profile`  | Get vendor profile    |
| PUT    | `/api/vendor/profile`  | Update vendor profile |
| GET    | `/api/vendor/products` | Get vendor products   |
| GET    | `/api/vendor/orders`   | Get vendor orders     |

### Admin

| Method | Endpoint                         | Description          |
| ------ | -------------------------------- | -------------------- |
| GET    | `/api/admin/dashboard`           | Dashboard statistics |
| GET    | `/api/admin/users`               | Get all users        |
| GET    | `/api/admin/vendors/pending`     | Get pending vendors  |
| PUT    | `/api/admin/vendors/:id/approve` | Approve vendor       |
| PUT    | `/api/admin/vendors/:id/reject`  | Reject vendor        |

---

## 🗄️ Database Schema Overview

### Core Tables

- **users**: Platform users with roles (user, vendor, admin)
- **vendors**: Vendor profiles with approval status
- **categories**: Product categories
- **products**: Vendor products with inventory management
- **carts & cart_items**: User shopping carts
- **orders & order_items**: Order management
- **coupons**: Promotional codes

### Key Relationships

```
Users (1) ─────< Vendors (1)
     │
     └────< Carts (1) ─────< Cart Items (many) ─────< Products (1)
     │
     └────< Orders (1) ─────< Order Items (many) ─────< Products (1)
```

---

## 👥 User Roles & Permissions

| Feature           | User    | Vendor | Admin |
| ----------------- | ------- | ------ | ----- |
| Browse Products   | ✅      | ✅     | ✅    |
| Add to Cart       | ✅      | ✅     | ✅    |
| Place Orders      | ✅      | ✅     | ✅    |
| Manage Own Orders | ✅      | ✅     | ✅    |
| Create Products   | ❌      | ✅     | ✅    |
| Manage Own Store  | ❌      | ✅     | ✅    |
| Manage Categories | ❌      | ❌     | ✅    |
| Manage Users      | ❌      | ❌     | ✅    |
| Approve Vendors   | ❌      | ❌     | ✅    |
| Create Coupons    | ❌      | ❌     | ✅    |
| View Dashboard    | Limited | ✅     | ✅    |

---

## 🔧 Key Implementation Highlights

### Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- CORS and Helmet security headers
- Rate limiting on API endpoints
- HTTP-only secure cookies
- Input validation and sanitization

### Performance Optimizations

- Database indexing for query optimization
- Static file serving with Express
- React lazy loading
- Optimized database connections

### Scalability Considerations

- RESTful API architecture
- Modular route and controller structure
- Scalable database schema with proper relationships
- Cloud image storage integration

---

## 📦 Available Scripts

### Root Directory

```
bash
npm run dev        # Start development server
npm run build     # Build for production
npm start         # Start production server
```

### Client Directory

```bash
cd client
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Zishan**

- Full Stack Developer
- MERN/PERN Stack Specialist

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite](https://vitejs.dev/)

---

<p align="center">
  Made with ❤️ by <strong>Zishan</strong>
</p>

<p align="center">
  <a href="#top">Back to top ⬆️</a>
</p>
