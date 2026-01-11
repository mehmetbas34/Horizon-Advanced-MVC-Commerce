# HorizonShop - Advanced ASP.NET MVC 5 E-Commerce Platform

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0872e8aa-dc7a-4a59-81c4-c0bee8cc5db1" />
<img width="1911" height="1078" alt="image" src="https://github.com/user-attachments/assets/01720ac8-3486-414b-8454-4fe986b6d70e" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/05b2f03c-1f7a-4460-aab2-aee19b9b034c" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/19f7a71c-ebc8-474f-af33-1a36ed0e12fd" />

## 🚀 Overview
HorizonShop is a robust, full-featured B2C e-commerce application built with **ASP.NET MVC 5** and **Entity Framework (Code First)**.

Unlike simple CRUD apps, this project implements real-world e-commerce logic, including a **Hybrid Shopping Cart Architecture** that merges guest sessions with persistent databases, a transactional checkout system, and a custom-secured admin panel.

## 🌟 Key Features

### 🛒 Hybrid Cart & Smart Merge System
- **Guest Users:** Cart items are stored in `Session` (RAM) to minimize database load.
- **Registered Users:** Cart items are stored in the `SQL Database` for persistence.
- **Smart Merge Algorithm:** When a guest user logs in, their temporary session cart is automatically merged into their persistent database account, ensuring no loss of potential sales.

### 🔒 Custom Security & Authorization
- Implements a custom `[AdminAuthorize]` ActionFilterAttribute for Role-Based Access Control (RBAC).
- Prevents unauthorized access to backend management panels (Products, Categories, Users) without relying solely on standard ASP.NET Identity.

### 💳 Transactional Checkout
- Ensures data integrity during the order process.
- **Flow:** `Order Creation` -> `Payment Simulation` -> `Order Items Transfer` -> `Cart Clearing`.
- All steps must succeed within the transaction scope; otherwise, the operation rolls back.

### 🎨 Dynamic Storefront
- **Search Engine:** LINQ-based search filtering by product name and description.
- **Category Filtering:** Dynamic product listing based on category selection.
- **Coupon System:** Real-time discount calculation and validation logic.

### ⚙️ Admin Management
- **Product & Category Management:** Full CRUD operations.
- **Optimized Image Handling:** Product images are saved to the physical file system (`~/Content/images/`), while only the file paths are stored in the database to optimize SQL performance.
- **User Role Management:** Admins can promote/demote users (with self-demotion protection).

## 🛠️ Tech Stack
- **Framework:** ASP.NET MVC 5 (.NET Framework)
- **Database:** MS SQL Server (LocalDB / Express)
- **ORM:** Entity Framework 6 (Code First Workflow)
- **Frontend:** Razor View Engine, HTML5, CSS3, JavaScript/jQuery
- **Tools:** Visual Studio, Git

## 👑 How to Create the First Admin Account
- By default, all new registrations are assigned the "Customer" role for security reasons. To access the Admin Panel, you must manually promote a user.
- Register a User: Go to the application in your browser, click Register, and create a new account (e.g., admin@horizon.com).
- Open SQL Server: Open SQL Server Management Studio (SSMS) or use the Server Explorer in Visual Studio.
- Find the User: Locate the Users table in the HorizonShop database.
- Update Role: Find your newly created user row and manually change the Role column value from "Customer" to "Admin".
- Log In: Go back to the website and log in. You will now have access to the Admin features (Product Management, User Roles, etc.) protected by the [AdminAuthorize] attribute .

## 📂 Project Structure
```text
HorizonShop/
├── Controllers/       # Logic for Cart, Account, Products, etc.
├── Models/            # EF Entities (Product, User, CartItem, etc.)
├── Views/             # Razor (.cshtml) pages
├── Content/           # CSS, Images, and uploaded product photos
└── Helpers/           # Custom Attributes like [AdminAuthorize]



Clone the repository

git clone https://github.com/mehmetbas34/HorizonShop.git
https://github.com/mehmetbas34/HorizonShop.git
Open in Visual Studio Open the .sln file in Visual Studio.

Restore NuGet Packages Right-click on the solution -> Restore NuGet Packages.
Database Setup (Code First) Open Package Manager Console and run:

PowerShell
Update-Database
--This will create the database and tables automatically based on the Models.

Run the Project Press F5 to start the application.
