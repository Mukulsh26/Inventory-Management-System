import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>

      {orders.map((o) => (
        <div key={o.id}>
          Order #{o.id} - Qty: {o.quantity}
        </div>
      ))}
    </div>
  );
}