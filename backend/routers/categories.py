from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models import Category
from schemas import CategoryCreate, CategoryOut
from security import get_current_user, require_admin

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("", response_model=CategoryOut)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    new_category = Category(**payload.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    result = db.execute(select(Category))
    return result.scalars().all()


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, payload: CategoryCreate, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category.name = payload.name
    category.description = payload.description
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {"message": f"Category {category_id} deleted"}