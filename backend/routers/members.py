from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models import Member
from schemas import MemberCreate, MemberOut
from security import get_current_user, require_admin

router = APIRouter(prefix="/members", tags=["Members"])


@router.post("", response_model=MemberOut)
def create_member(payload: MemberCreate, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    new_member = Member(**payload.model_dump())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


@router.get("", response_model=list[MemberOut])
def list_members(db: Session = Depends(get_db)):
    result = db.execute(select(Member))
    return result.scalars().all()


@router.put("/{member_id}", response_model=MemberOut)
def update_member(member_id: int, payload: MemberCreate, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    member = db.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    member.name = payload.name
    member.email = payload.email
    member.phone = payload.phone
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db), current_user: str = Depends(require_admin)):
    member = db.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return {"message": f"Member {member_id} deleted"}