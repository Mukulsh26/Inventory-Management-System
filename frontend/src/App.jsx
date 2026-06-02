import "./App.css";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

function App() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">
        Inventory Management System
      </h1>

      <div className="dashboard-grid">
        <Products />
        <Customers />
        <Orders />
      </div>
    </div>
  );
}

export default App;