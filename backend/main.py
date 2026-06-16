
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///notes.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)


class NoteCreate(BaseModel):
    text: str


Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Hello Rahul from FastAPI"}


@app.get("/notes")
def get_notes():
    db = SessionLocal()

    notes = db.query(Note).all()

    return [
        {"id": note.id, "text": note.text}
        for note in notes
    ]


@app.post("/notes")
def create_note(note: NoteCreate):
    db = SessionLocal()

    new_note = Note(text=note.text)

    db.add(new_note)
    db.commit()

    return {"message": "Note added"}

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    db = SessionLocal()

    note = db.query(Note).filter(Note.id == note_id).first()

    if note:
        db.delete(note)
        db.commit()

    return {"message": "Note deleted"}
 
@app.put("/notes/{note_id}")
def update_note(note_id: int, note: NoteCreate):
    db = SessionLocal()

    existing_note = db.query(Note).filter(Note.id == note_id).first()

    if existing_note:
        existing_note.text = note.text
        db.commit()

    return {"message": "Note updated"}
