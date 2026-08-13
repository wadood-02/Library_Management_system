from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models import Loan, Book
from schemas import LoanCreate, LoanOut

router = APIRouter(prefix="/loans", tags=["Loans"])


@router.post("/issue", response_model=LoanOut)
def issue_loan(payload: LoanCreate, db: Session = Depends(get_db)):
    book = db.get(Book, payload.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.available_copies < 1:
        raise HTTPException(status_code=400, detail="No copies available for this book")

    new_loan = Loan(
        book_id=payload.book_id,
        member_id=payload.member_id,
        issue_date=date.today(),
        due_date=date.today() + timedelta(days=14),
    )
    book.available_copies -= 1

    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan


@router.post("/{loan_id}/return", response_model=LoanOut)
def return_loan(loan_id: int, db: Session = Depends(get_db)):
    loan = db.get(Loan, loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.return_date is not None:
        raise HTTPException(status_code=400, detail="This loan was already returned")

    loan.return_date = date.today()

    book = db.get(Book, loan.book_id)
    book.available_copies += 1

    db.commit()
    db.refresh(loan)
    return loan


@router.get("", response_model=list[LoanOut])
def list_loans(db: Session = Depends(get_db)):
    result = db.execute(select(Loan))
    return result.scalars().all()