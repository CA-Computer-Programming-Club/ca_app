from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8081", 
    "http://127.0.0.1:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/add_lost_item")
def add_lost_item():
    return "Testerone"


@app.get("/add_found_item")
def add_found_item():
    return "Estrogen"


@app.get("/get_lost_items")
def get_lost_items():
    return "ok"


@app.get("/get_found_items")
def get_found_items():
    return {"item_id": [1, 2, 3, 4], "description": ["phone", "wallet", "keys", "bag"]}
