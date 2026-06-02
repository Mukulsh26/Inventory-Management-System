import { useEffect, useState } from "react";
import api from "../services/api";

export default function Customers() {

  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Customers</h2>

      {customers.map((c) => (
        <div key={c.id}>
          {c.full_name} - {c.email}
        </div>
      ))}
    </div>
  );
}