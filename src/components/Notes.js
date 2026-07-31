import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { TrashIcon } from "./Icons";
import { useToast } from "../contexts/ToastContext";

function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (!cancelled && !error) setNotes(data);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  async function addNote() {
    if (!draft.trim()) return;

    const { data, error } = await supabase
      .from("notes")
      .insert({ user_id: user.id, content: draft.trim() })
      .select()
      .single();

    if (!error) {
      setNotes([data, ...notes]);
      setDraft("");
    }
  }

  async function updateNote(id, content) {
    await supabase
      .from("notes")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  async function deleteNote(id) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) {
      setNotes(notes.filter((n) => n.id !== id));
      showToast("Note deleted");
    }
  }

  if (loading) return <div className="card empty-state">Loading notes...</div>;

  return (
    <div className="card" style={{ padding: 22 }}>
      <div className="history-header">
        <h3>Notes</h3>
      </div>

      <div className="note-composer">
        <textarea
          placeholder="Jot something down..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
        />
        <button
          className="btn-primary"
          style={{ width: "auto", padding: "10px 18px" }}
          onClick={addNote}
        >
          Add
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="empty-state">
          No notes yet — write your first one above.
        </p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <textarea
                defaultValue={note.content}
                onBlur={(e) => updateNote(note.id, e.target.value)}
              />
              <div className="note-footer">
                <span>{new Date(note.updated_at).toLocaleString()}</span>
                <button onClick={() => deleteNote(note.id)}>
                  <TrashIcon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notes;
