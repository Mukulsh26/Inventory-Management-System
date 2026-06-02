import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Management System</h1>

      <Products />

      <hr />

      <Customers />

      <hr />

      <Orders />
    </div>
  );
}

export default App;