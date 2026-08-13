from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models import Book
from schemas import BookCreate, BookOut
from security import get_current_user, require_admin

router = APIRouter(prefix="/books", tags=["Books"])


@router.post("", response_model=BookOut)
def create_book(payload: BookCreate, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    new_book = Book(**payload.model_dump(), available_copies=payload.total_copies)
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book


@router.get("", response_model=list[BookOut])
def list_books(db: Session = Depends(get_db)):
    result = db.execute(select(Book))
    return result.scalars().all()


@router.put("/{book_id}", response_model=BookOut)
def update_book(book_id: int, payload: BookCreate, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book.title = payload.title
    book.author = payload.author
    book.isbn = payload.isbn
    book.total_copies = payload.total_copies
    book.category_id = payload.category_id
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"message": f"Book {book_id} deleted"}