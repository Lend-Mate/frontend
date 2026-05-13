import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'
import Products from './views/products.jsx'
import Favorites from './views/favorites.jsx'
import ShoppingCart from './views/shopping_cart.jsx'


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/products" element={<Products />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/shopping-cart" element={<ShoppingCart />} />
    </Routes>
  </BrowserRouter>,
);
