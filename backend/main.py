from typing import Union

from fastapi import FastAPI


app = FastAPI()


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
