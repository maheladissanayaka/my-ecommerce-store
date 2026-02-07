# 🛍️ Fashion Hub - E-Commerce Cloth Shop

A modern, full-stack E-Commerce application built with **Next.js 14 (App Router)**, **TypeScript**, and **MongoDB**. This application allows users to browse clothing items, view details, and manage their shopping experience with secure authentication.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ Features

- **🛒 Product Browsing:** View a list of clothing items with images and prices.
- **🔐 User Authentication:** Secure login and signup using **NextAuth.js**.
- **📱 Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop screens.
- **⚡ High Performance:** Built on Next.js for server-side rendering and fast page loads.
- **💾 Database:** MongoDB integration using Mongoose for data management.
- **🎨 Modern UI:** Styled with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/)
- **ORM:** [Mongoose](https://mongoosejs.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## 📂 Project Structure

Here is an overview of the main folder structure:

```bash
.
├── app/                # Next.js App Router (Pages & API routes)
├── components/         # Reusable UI components (Navbar, ProductCard, etc.)
├── lib/                # Utility functions & Database connection
│   └── mongodb.ts      # MongoDB connection logic (Singleton pattern)
├── models/             # Mongoose Schemas (User, Product, etc.)
├── public/             # Static assets (Images, Icons)
├── styles/             # Global styles
├── .env                # Environment variables (Git ignored)
└── package.json        # Project dependencies