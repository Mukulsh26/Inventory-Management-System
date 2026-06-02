from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    stock_quantity: int


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    stock_quantity: int

    class Config:
        from_attributes = True


class ProductUpdate(BaseModel):
    name: str
    sku: str
    price: float
    stock_quantity: int


class CustomerCreate(BaseModel):
    full_name: str
    email: str
    phone: str


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str

    class Config:
        from_attributes = True
        

class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int