import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // рендеримо тільки якщо сторінок більше 1

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      forcePage={currentPage - 1} // ReactPaginate 0-based
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel={"<"}
      nextLabel={">"}
    />
  );
};

export default Pagination;
