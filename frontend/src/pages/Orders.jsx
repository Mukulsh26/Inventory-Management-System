import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/orders");

      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async () => {
    try {
      setLoading(true);

      await api.post("/orders", {
        customer_id: Number(customerId),
        product_id: Number(productId),
        quantity: Number(quantity),
      });

      setCustomerId("");
      setProductId("");
      setQuantity("");

      setShowModal(false);

      await fetchOrders();
    } catch {
      alert("Unable to create order");
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      setLoading(true);

      await api.delete(`/orders/${id}`);

      await fetchOrders();
    } catch {
      alert("Unable to delete order");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="column">
        <div className="column-header">
          <h2>🛒 Orders</h2>
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
        <h2>🛒 Orders</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Create
        </button>
      </div>

      {orders.map((o) => (
        <div className="item-card" key={o.id}>
          <h4>Order #{o.id}</h4>

          <p>
            <strong>Customer:</strong> {o.customer_id}
          </p>

          <p>
            <strong>Product:</strong> {o.product_id}
          </p>

          <p>
            <strong>Quantity:</strong> {o.quantity}
          </p>

          <p>
            <strong>Total:</strong> ₹{o.total_amount}
          </p>

          <button
            className="btn btn-danger"
            onClick={() => deleteOrder(o.id)}
          >
            Delete Order
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
            <h3>Create Order</h3>

            <input
              placeholder="Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />

            <input
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />

            <input
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
                onClick={createOrder}
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}