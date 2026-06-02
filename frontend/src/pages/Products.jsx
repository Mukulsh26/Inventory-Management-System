import { useEffect, useState } from "react";
import api from "../services/api";

export default function Products() {

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.map((p) => (
        <div key={p.id}>
          {p.name} - ₹{p.price} - Stock: {p.stock_quantity}
        </div>
      ))}
    </div>
  );
}