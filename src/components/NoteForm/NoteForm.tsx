import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";
import { toast } from "react-hot-toast";
import type { NoteTag } from "../../types/note";

interface NoteFormProps {
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");

  const queryClient = useQueryClient();

  const { mutate: createNoteMutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created!");
      onCancel();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNoteMutate({ title, content, tag });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <span className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <span className={css.error} />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
