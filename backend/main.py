from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine
from models import Base, Product, Customer, Order
from schemas import ProductCreate, ProductUpdate, CustomerCreate, OrderCreate

app = FastAPI(title="Inventory Management API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Inventory Management API Running"}


@app.post("/products")
def create_product(product: ProductCreate):

    db: Session = SessionLocal()

    existing = db.query(Product).filter(
        Product.sku == product.sku
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    new_product = Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        stock_quantity=product.stock_quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@app.get("/products")
def get_products():

    db: Session = SessionLocal()

    products = db.query(Product).all()

    return products


@app.get("/products/{product_id}")
def get_product(product_id: int):

    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: ProductUpdate
):

    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = updated_product.name
    product.sku = updated_product.sku
    product.price = updated_product.price
    product.stock_quantity = updated_product.stock_quantity

    db.commit()
    db.refresh(product)

    return product


@app.delete("/products/{product_id}")
def delete_product(product_id: int):

    db = SessionLocal()

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }

@app.post("/customers")
def create_customer(customer: CustomerCreate):

    db = SessionLocal()

    existing = db.query(Customer).filter(
        Customer.email == customer.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_customer = Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@app.get("/customers")
def get_customers():

    db = SessionLocal()

    customers = db.query(Customer).all()

    return customers


@app.get("/customers/{customer_id}")
def get_customer(customer_id: int):

    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int):

    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }

@app.post("/orders")
def create_order(order: OrderCreate):

    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    product = db.query(Product).filter(
        Product.id == order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.stock_quantity < order.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient inventory"
        )

    total_amount = product.price * order.quantity

    product.stock_quantity -= order.quantity

    new_order = Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_amount=total_amount
    )

    db.add(new_order)

    db.commit()

    db.refresh(new_order)

    return new_order


@app.get("/orders")
def get_orders():

    db = SessionLocal()

    return db.query(Order).all()


@app.get("/orders/{order_id}")
def get_order(order_id: int):

    db = SessionLocal()

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@app.delete("/orders/{order_id}")
def delete_order(order_id: int):

    db = SessionLocal()

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(order)

    db.commit()

    return {
        "message": "Order deleted successfully"
    }