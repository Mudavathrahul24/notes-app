import { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const loadNotes = async () => {
    const response = await fetch("http://127.0.0.1:8000/notes");
    const data = await response.json();

    setNotes(data);
  };

  const addNote = async () => {
    await fetch("http://127.0.0.1:8000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: note,
      }),
    });

    setNote("");
    loadNotes();
  };
  const deleteNote = async (id) => {
  await fetch(`http://127.0.0.1:8000/notes/${id}`, {
    method: "DELETE",
  });

  loadNotes();
};
const updateNote = async () => {
  await fetch(`http://127.0.0.1:8000/notes/${editingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: note,
    }),
  });

  setNote("");
  setEditingId(null);
  loadNotes();
};

  useEffect(() => {
    loadNotes();
  }, []);

  return (
  <div className="container">
    <div className="title">
  <img src="/images.png" alt="logo" className="logo" />
  <h1>Notes App</h1>
</div>

    <div className="input-row">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter note"
      />

      <button onClick={editingId ? updateNote : addNote}>
  {editingId ? "Update Note" : "Add Note"}
</button>
    </div>

    <h2>My Notes</h2>

    {notes.map((n) => (
  <div className="note" key={n.id}>
    <span>{n.text}</span>

    <div>
      <button
        onClick={() => {
          setNote(n.text);
          setEditingId(n.id);
        }}
      >
        Edit
      </button>

      <button onClick={() => deleteNote(n.id)}>
        Delete
      </button>
    </div>
  </div>
))}
  </div>
);
}

export default App;