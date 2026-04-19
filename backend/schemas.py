from pydantic import BaseModel, field_validator
from typing import Optional


class InventoryItemCreate(BaseModel):
    inventory_name: str
    description: Optional[str] = None

    @field_validator("inventory_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("inventory_name cannot be empty")
        return v


class InventoryItemUpdate(BaseModel):
    inventory_name: str
    description: Optional[str] = None

    @field_validator("inventory_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("inventory_name cannot be empty")
        return v


class InventoryItemResponse(BaseModel):
    id: int
    inventory_name: str
    description: Optional[str] = None
    has_photo: bool

    model_config = {"from_attributes": True}
