import { useEffect, useState } from "react";
import api from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/customers");

      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async () => {
    try {
      setLoading(true);

      await api.post("/customers", {
        full_name: fullName,
        email,
        phone,
      });

      setFullName("");
      setEmail("");
      setPhone("");

      setShowModal(false);

      await fetchCustomers();
    } catch {
      alert("Unable to create customer");
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      setLoading(true);

      await api.delete(`/customers/${id}`);

      await fetchCustomers();
    } catch {
      alert("Unable to delete customer");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="column">
        <div className="column-header">
          <h2>👤 Customers</h2>
        </div>

        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="column">
      <div className="column-header">
        <h2>👤 Customers</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add
        </button>
      </div>

      {customers.map((c) => (
        <div className="item-card" key={c.id}>
          <h4>{c.full_name}</h4>

          <p>
            <strong>ID: </strong> {c.id}
          </p>
          
          <p>
            <strong>Email:</strong> {c.email}
          </p>

          <p>
            <strong>Phone:</strong> {c.phone}
          </p>

          <button
            className="btn btn-danger"
            onClick={() => deleteCustomer(c.id)}
          >
            Delete
          </button>
        </div>
      ))}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Add Customer</h3>

            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={addCustomer}
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}