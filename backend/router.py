import shutil
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models import InventoryItem
from schemas import InventoryItemResponse, InventoryItemUpdate

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

router = APIRouter()


def _photo_path(item_id: int) -> Optional[Path]:
    """Return the photo file path for an item, or None if no photo exists."""
    for ext in ALLOWED_EXTENSIONS:
        path = UPLOAD_DIR / f"{item_id}{ext}"
        if path.exists():
            return path
    return None


def _delete_photo(item_id: int) -> None:
    """Delete the photo file for an item if it exists."""
    path = _photo_path(item_id)
    if path:
        path.unlink(missing_ok=True)


@router.get("/inventory", response_model=list[InventoryItemResponse])
def list_inventory(db: Session = Depends(get_db)):
    return db.query(InventoryItem).order_by(InventoryItem.id).all()


@router.get("/inventory/{item_id}", response_model=InventoryItemResponse)
def get_inventory(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/register", response_model=InventoryItemResponse, status_code=201)
async def create_inventory(
    inventory_name: str = Form(...),
    description: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    inventory_name = inventory_name.strip()
    if not inventory_name:
        raise HTTPException(status_code=422, detail="inventory_name cannot be empty")

    item = InventoryItem(inventory_name=inventory_name, description=description)
    db.add(item)
    db.commit()
    db.refresh(item)

    if photo and photo.filename:
        ext = Path(photo.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            ext = ".jpg"
        file_path = UPLOAD_DIR / f"{item.id}{ext}"
        with open(file_path, "wb") as f:
            shutil.copyfileobj(photo.file, f)
        item.has_photo = True
        db.commit()
        db.refresh(item)

    return item


@router.put("/inventory/{item_id}", response_model=InventoryItemResponse)
def update_inventory(
    item_id: int,
    payload: InventoryItemUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.inventory_name = payload.inventory_name.strip()
    item.description = payload.description
    db.commit()
    db.refresh(item)
    return item


@router.put("/inventory/{item_id}/photo", response_model=InventoryItemResponse)
async def update_inventory_photo(
    item_id: int,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if not photo.filename:
        raise HTTPException(status_code=422, detail="No file provided")

    _delete_photo(item_id)

    ext = Path(photo.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".jpg"
    file_path = UPLOAD_DIR / f"{item_id}{ext}"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(photo.file, f)

    item.has_photo = True
    db.commit()
    db.refresh(item)
    return item


@router.delete("/inventory/{item_id}", status_code=204)
def delete_inventory(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    _delete_photo(item_id)
    db.delete(item)
    db.commit()


@router.get("/inventory/{item_id}/photo")
def get_inventory_photo(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    path = _photo_path(item_id)
    if not path:
        raise HTTPException(status_code=404, detail="Photo not found")

    return FileResponse(path)
