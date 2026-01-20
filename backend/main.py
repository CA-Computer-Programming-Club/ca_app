from typing import Union, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uuid
import sqlite3
import os
from pathlib import Path
from datetime import datetime, timezone

app = FastAPI()

DATABASE_URL = "database.db"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_db_connection():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT CHECK (type IN ('lost', 'found')) NOT NULL,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            image_filename TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_type ON items(type)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_location ON items(location)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_created_at ON items(created_at)")
    conn.commit()
    conn.close()


# Initialize database on startup
init_db()

origins = [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:8080",  # Add Expo dev server
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

# Mount uploaded images so frontend can fetch them via URL
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


class ItemCreate(BaseModel):
    type: str
    title: str
    location: str
    description: str
    image_filename: str = None


class ItemResponse(BaseModel):
    id: int
    type: str
    title: str
    location: str
    description: str
    image_filename: str = None
    created_at: str


def save_uploaded_file(file: UploadFile) -> str:
    """Save uploaded file and return the filename"""
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        content = file.file.read()
        # if len(content) > MAX_FILE_SIZE:
        # raise HTTPException(status_code=400, detail="File too large")
        buffer.write(content)

    return filename


@app.post("/add_lost_item")
async def add_lost_item(
    title: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(None),
):
    return await add_item_to_db("lost", title, location, description, image)


@app.post("/add_found_item")
async def add_found_item(
    title: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(None),
):
    return await add_item_to_db("found", title, location, description, image)


# TODO UPDATE ITEMS
# updated_at = utc_now_iso()

# cursor.execute(
#     """
#     UPDATE items
#     SET title = ?, description = ?, updated_at = ?
#     WHERE id = ?
#     """,
#     (title, description, updated_at, item_id),
# )


async def add_item_to_db(
    item_type: str,
    title: str,
    location: str,
    description: str,
    image: UploadFile = None,
):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        image_filename = None
        if image and image.filename:
            image_filename = save_uploaded_file(image)

        created_at = utc_now_iso()
        updated_at = created_at

        cursor.execute(
            """
            INSERT INTO items (
                type, title, location, description,
                image_filename, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                item_type,
                title,
                location,
                description,
                image_filename,
                created_at,
                updated_at,
            ),
        )

        item_id = cursor.lastrowid
        conn.commit()

        created_item = cursor.execute(
            "SELECT * FROM items WHERE id = ?", (item_id,)
        ).fetchone()

        conn.close()

        return dict(created_item)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Error adding item: {str(e)}")


@app.get("/get_lost_items")
def get_lost_items():
    return get_items_by_type("lost")


@app.get("/get_found_items")
def get_found_items():
    return get_items_by_type("found")


def get_items_by_type(item_type: str):
    conn = get_db_connection()
    try:
        items = conn.execute(
            "SELECT * FROM items WHERE type = ? ORDER BY created_at DESC", (item_type,)
        ).fetchall()
        conn.close()
        return [dict(item) for item in items]
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Error fetching items: {str(e)}")


@app.get("/get_all_items")
def get_all_items():
    conn = get_db_connection()
    try:
        items = conn.execute("SELECT * FROM items ORDER BY created_at DESC").fetchall()
        conn.close()
        return [dict(item) for item in items]
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Error fetching items: {str(e)}")
