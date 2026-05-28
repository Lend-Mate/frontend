import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import App from './App.jsx'
import Products from './views/products.jsx'
import Favorites from './views/favorites.jsx'
import ShoppingCart from './views/shopping_cart.jsx'
import Advert from "./views/advert.jsx";
import Auth from "./views/auth.jsx";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
}

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<PrivateRoute><App /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
      <Route path="/shopping-cart" element={<PrivateRoute><ShoppingCart /></PrivateRoute>} />
      <Route path="/advert" element={<PrivateRoute><Advert /></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
);