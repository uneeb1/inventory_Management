# E-commerce Product Listing Page

A modern, responsive e-commerce product listing page built with React. It fetches product data from a Supabase backend and allows users to filter and paginate through the products.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- A Supabase account and a new project created.

### Installation

1.  Clone the repo:
    ```bash
    git clone https://github.com/your_username/your_project_name.git
    ```
2.  Install NPM packages:
    ```bash
    npm install
    ```
3.  Set up your environment variables. Create a `.env.local` file in the root of your project and add your Supabase URL and Anon Key:
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
4.  Run the SQL queries in `backend/categories.sql` and `backend/product.sql` in your Supabase SQL editor to set up the database tables and seed them with data.

5.  Run the development server:
    ```bash
    npm run dev
    ```

Visit the provided localhost URL in your browser to see the application in action.

## ✨ Features

- **Product Listing**: Displays a grid of products with images, names, and prices.
- **Filtering**: Filter products by category.
- **Pagination**: Navigate through pages of products.
- **Responsive Design**: Works on mobile and desktop devices.
- **Error Handling**: Gracefully handles errors during data fetching.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Backend**: Supabase (for database and API)
- **Styling**: Tailwind CSS
- **Data Fetching**: `@supabase/supabase-js`

## 📁 Project Structure

```
├── backend/
│   ├── categories.sql      # SQL schema for categories
│   └── product.sql         # SQL schema for products
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Pagination.jsx
│   │   └── ProductCard.jsx
│   ├── App.jsx              # Main application component
│   ├── index.css           # Tailwind directives and base styles
│   ├── main.jsx            # React application entry point
│   └── supabaseClient.js   # Supabase client configuration
├── .env.local              # Environment variables for Supabase
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite build configuration
└── package.json            # Dependencies and scripts
```

---

**Built with React, Vite, Supabase, and Tailwind CSS**
