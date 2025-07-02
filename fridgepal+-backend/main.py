from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.query import Query
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models import FridgeItem
from typing import List
from datetime import datetime, timezone
import os
import logging


load_dotenv()


logging.basicConfig(level=logging.INFO)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
client.set_key(os.getenv("APPWRITE_API_KEY"))


database = Databases(client)
DATABASE_ID = os.getenv("APPWRITE_DATABASE_ID")
COLLECTION_ID = os.getenv("APPWRITE_COLLECTION_ID")




@app.get("/items", response_model=List[FridgeItem])
def get_items(category: str = None, search: str = None):
    queries = [Query.equal("deleted", False)]

    if category:
        queries.append(Query.equal("category", category))

    if search:
        queries.append(Query.contains("name", [search]))  

    result = database.list_documents(DATABASE_ID, COLLECTION_ID, queries=queries)

    items = []
    for doc in result["documents"]:
        item = FridgeItem(**doc)
        days_left = (item.expiry_date - datetime.now(timezone.utc)).days
        item.status = (
            "expired" if days_left < 0 else
            "expiring" if days_left <= 5 else
            "fresh"
        )
        items.append(item)

    return items



@app.get("/trash", response_model=List[FridgeItem])
def get_trashed_items():
    result = database.list_documents(DATABASE_ID, COLLECTION_ID, queries=[Query.equal("deleted", True)])
    return [FridgeItem(**doc) for doc in result["documents"]]


@app.post("/items", response_model=FridgeItem)
def add_item(item: FridgeItem) -> FridgeItem:
    data = item.dict(exclude={"status", "id"}, by_alias=True)
    if isinstance(data.get("expiry_date"), datetime):
        data["expiry_date"] = data["expiry_date"].isoformat()

    new_doc = database.create_document(
        database_id=DATABASE_ID,
        collection_id=COLLECTION_ID,
        document_id="unique()",
        data=data
    )
    return FridgeItem(**new_doc)


@app.put("/items/{item_id}", response_model=FridgeItem)
def update_item(item_id: str, updated: FridgeItem):
    try:
        data = updated.dict(exclude={"status", "id"}, by_alias=True)
        if isinstance(data.get("expiry_date"), datetime):
            data["expiry_date"] = data["expiry_date"].isoformat()

        doc = database.update_document(
            database_id=DATABASE_ID,
            collection_id=COLLECTION_ID,
            document_id=item_id,
            data=data
        )
        return FridgeItem(**doc)
    except Exception as e:
        logging.error(f"Update error: {e}")
        raise HTTPException(status_code=404, detail="Item not found")


@app.delete("/items/{item_id}")
def soft_delete_item(item_id: str):
    try:
        database.update_document(
            database_id=DATABASE_ID,
            collection_id=COLLECTION_ID,
            document_id=item_id,
            data={"deleted": True}
        )
        return {"message": "Item moved to trash"}
    except Exception as e:
        logging.error(f"Soft delete error: {e}")
        raise HTTPException(status_code=404, detail="Item not found")


@app.patch("/items/{item_id}/decrement")
def decrement_quantity(item_id: str, amount: float = Body(..., embed=True)) -> dict:
    try:
        doc = database.get_document(DATABASE_ID, COLLECTION_ID, item_id)
        current_quantity = doc.get("quantity", 0)
        new_quantity = current_quantity - amount

        update_data = {"quantity": new_quantity}
        if new_quantity <= 0:
            update_data["deleted"] = True

        updated_doc = database.update_document(
            DATABASE_ID,
            COLLECTION_ID,
            item_id,
            data=update_data
        )

        return {"message": "Quantity updated", "item": updated_doc}
    except Exception as e:
        logging.error(f"Decrement error: {e}")
        raise HTTPException(status_code=404, detail="Item not found")


@app.get("/alerts/low-stock", response_model=List[FridgeItem])
def low_stock_alerts():
    result = database.list_documents(DATABASE_ID, COLLECTION_ID, queries=[Query.equal("deleted", False)])
    alerts = []

    for doc in result["documents"]:
        item = FridgeItem(**doc)
        if item.threshold is not None and item.quantity <= item.threshold:
            alerts.append(item)

    return alerts


@app.get("/recipes/suggestions")
def suggest_recipes() -> dict:
    try:
        
        SYNONYMS = {
            "eggs": "egg",
            "tomatoes": "tomato",
            "bananas": "banana",
            "potatoes": "potato",
            "onions": "onion",
            "cucumbers": "cucumber",
            "carrots": "carrot",
            "apples": "apple",
            
        }

        def normalize(item: str) -> str:
            return SYNONYMS.get(item.lower(), item.lower())

        
        result = database.list_documents(DATABASE_ID, COLLECTION_ID, queries=[Query.equal("deleted", False)])
        available_items = [normalize(doc["name"]) for doc in result["documents"]]

        
        recipes = [
            {
                "name": "Omelette",
                "ingredients": ["egg", "milk"],
                "instructions": "Beat eggs with milk and cook in a pan."
            },
            {
                "name": "Fruit Smoothie",
                "ingredients": ["banana", "milk"],
                "instructions": "Blend banana with chilled milk."
            },
            {
                "name": "Salad",
                "ingredients": ["lettuce", "tomato", "cucumber"],
                "instructions": "Chop and toss everything with salt."
            }
        ]

       
        matching = [r for r in recipes if all(i in available_items for i in r["ingredients"])]

        
        logging.info(f"Available items: {available_items}")

        return {
            "available_ingredients": available_items,
            "recipes": matching
        }

    except Exception as e:
        logging.error(f"Recipe suggestion error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate suggestions")


@app.patch("/items/{item_id}/restore")
def restore_item(item_id: str):
    try:
        doc = database.update_document(
            database_id=DATABASE_ID,
            collection_id=COLLECTION_ID,
            document_id=item_id,
            data={"deleted": False}
        )
        return {"message": "Item restored", "item": doc}
    except Exception as e:
        logging.error(f"Restore error: {e}")
        raise HTTPException(status_code=404, detail="Item not found")


@app.delete("/permanent-delete/{item_id}")
def permanently_delete_item(item_id: str):
    try:
        database.delete_document(DATABASE_ID, COLLECTION_ID, item_id)
        return {"message": "Item permanently deleted"}
    except Exception as e:
        logging.error(f"Permanent delete error: {e}")
        raise HTTPException(status_code=404, detail="Item not found")
