import { useState } from "react";
import api from "../services/api";

export default function Products({
  products,
  refreshAll,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const addProduct = async () => {
    try {
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

      await refreshAll();
    } catch {
      alert("Unable to create product");
    }
  };

  const updateProduct = async () => {
  try {
    await api.put(`/products/${editingId}`, {
      name,
      sku,
      price: Number(price),
      stock_quantity: Number(stock),
    });

    setEditingId(null);

    setName("");
    setSku("");
    setPrice("");
    setStock("");

    setShowModal(false);

    await refreshAll();
  } catch {
    alert("Unable to update product");
  }
};

  const handleEdit = (product) => {
  setEditingId(product.id);

  setName(product.name);
  setSku(product.sku);
  setPrice(product.price);
  setStock(product.stock_quantity);

  setShowModal(true);
};

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);

      await refreshAll();
    } catch {
      alert("Unable to delete product");
    }
  };

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
            <strong>ID:</strong> {p.id}
          </p>

          <p>
            <strong>SKU:</strong> {p.sku}
          </p>

          <p>
            <strong>Price:</strong> ₹{p.price}
          </p>

          <p>
            <strong>Stock:</strong> {p.stock_quantity}
          </p>

          <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  }}
>
  <button
    className="btn btn-primary"
    onClick={() => handleEdit(p)}
  >
    Edit
  </button>

  <button
    className="btn btn-danger"
    onClick={() => deleteProduct(p.id)}
  >
    Delete
  </button>
</div>
        </div>
      ))}

      {showModal && (
       <div
  className="modal-overlay"
  onClick={() => {
    setEditingId(null);
    setShowModal(false);
  }}
>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
           <h3>
  {editingId ? "Edit Product" : "Add Product"}
</h3>

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
  onClick={() => {
    setEditingId(null);
    setShowModal(false);
  }}
>
  Cancel
</button>

             <button
  className="btn btn-primary"
  onClick={
    editingId
      ? updateProduct
      : addProduct
  }
>
  {editingId
    ? "Update Product"
    : "Save Product"}
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}