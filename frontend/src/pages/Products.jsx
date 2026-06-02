import { useEffect, useState } from "react";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    try {
      setLoading(true);

      await api.post("/products", {
        name,
        sku,
        price: Number(price),
        stock_quantity: Number(stock),
      });

      setName("");
      setSku("");
      setPrice("");
      setStock("");

      setShowModal(false);

      await fetchProducts();
    } catch {
      alert("Unable to create product");
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);

      await api.delete(`/products/${id}`);

      await fetchProducts();
    } catch {
      alert("Unable to delete product");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="column">
        <div className="column-header">
          <h2>📦 Products</h2>
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
        <h2>📦 Products</h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add
        </button>
      </div>

      {products.map((p) => (
        <div className="item-card" key={p.id}>
          <h4>{p.name}</h4>

          <p>
            <strong>SKU:</strong> {p.sku}
          </p>

          <p>
            <strong>Price:</strong> ₹{p.price}
          </p>

          <p>
            <strong>Stock:</strong> {p.stock_quantity}
          </p>

          <button
            className="btn btn-danger"
            onClick={() => deleteProduct(p.id)}
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
            <h3>Add Product</h3>

            <input
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />

            <input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              placeholder="Stock Quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
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
                onClick={addProduct}
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}