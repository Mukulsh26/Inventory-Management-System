import { useEffect, useState } from "react";
import "./App.css";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import api from "./services/api";

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  const refreshAll = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchProducts(),
        fetchCustomers(),
        fetchOrders(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">
        Inventory Management System
      </h1>

      <div className="dashboard-grid">
        <Products
          products={products}
          refreshAll={refreshAll}
        />

        <Customers
          customers={customers}
          refreshAll={refreshAll}
        />

        <Orders
          orders={orders}
          refreshAll={refreshAll}
        />
      </div>
    </div>
  );
}

export default App;