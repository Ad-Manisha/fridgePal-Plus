from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class FridgeItem(BaseModel):
    id: Optional[str] = Field(None, alias="$id")  # <-- add this
    name: str
    quantity: float
    unit: str
    category: str
    tags: Optional[List[str]] = []
    expiry_date: datetime
    threshold: float
    deleted: Optional[bool] = False
    status: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
