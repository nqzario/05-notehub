import { useState } from "react";
import css from "./App.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";

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

  // скидаємо сторінку при зміні пошуку
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading notes...</p>;

  return (
    <div className={css.app}>
      <Toaster position="top-right" reverseOrder={false} />

      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note
        </button>

        {data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </header>

      {data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
