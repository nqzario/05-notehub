import { useState } from "react";
import css from "./App.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import { Toaster, toast } from "react-hot-toast";
import NoteForm from "../NoteForm/NoteForm";

import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";

export interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const App = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note has been delete!");
    } catch (err) {
      console.error(err);
      toast.error("Note not delete!");
    }
  };

  const handleCreateNote = async (values: NoteFormValues) => {
    try {
      await createNote(values);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note has been created!");
    } catch (err) {
      console.error(err);
      toast.error("Note not created!");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading notes...</p>;

  return (
    <div className={css.app}>
      <Toaster position="top-right" reverseOrder={false} />
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} /> {/* ← ДОДАНО */}
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note
        </button>
        <Pagination
          totalPages={data.totalPages}
          currentPage={page}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </header>

      <NoteList notes={data.notes} onDelete={handleDeleteNote} />

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
