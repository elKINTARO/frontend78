from sqlalchemy import Column, Integer, String, Text, Boolean
from database import Base


class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    inventory_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    has_photo = Column(Boolean, default=False, nullable=False)
