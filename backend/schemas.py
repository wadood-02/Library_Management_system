from datetime import date
from pydantic import BaseModel

class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str | None = None
    total_copies: int = 1
    category_id: int | None = None


class BookOut(BaseModel):
    id: int
    title: str
    author: str
    isbn: str | None
    total_copies: int
    available_copies: int
    category_id: int | None
    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str
    description: str | None = None


class CategoryOut(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True

class MemberCreate(BaseModel):
    name: str
    email: str
    phone: str | None = None

class MemberOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None = None

    class Config:
        from_attributes = True

class LoanCreate(BaseModel):
    book_id: int
    member_id: int

class LoanOut(BaseModel):
    id: int
    book: BookOut
    member: MemberOut
    issue_date: date
    due_date: date
    return_date: date | None
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "user"


class UserOut(BaseModel):
    id: int
    username: str
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"