import React from "react";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";
import Icon from "../icon/Icon";

const PaginationComponent = ({ itemPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pageNumbers = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const middlePage = Math.floor(maxVisiblePages / 2);

      if (currentPage <= middlePage) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      } else if (currentPage >= totalPages - middlePage) {
        pageNumbers.push(1, "...");
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1, "...");
        for (let i = currentPage - middlePage; i <= currentPage + middlePage; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...", totalPages);
      }
    }

    return pageNumbers;
  };

  let paginationItms = getPageNumbers();

  const firstPage = () => {
    paginate(1);
  };

  const lastPage = () => {
    paginate(pageNumbers[pageNumbers.length - 1]);
  };

  const nextPage = () => {
    paginate(currentPage + 1);
  };

  const prevPage = () => {
    paginate(currentPage - 1);
  };

  return (
    <Pagination aria-label="Page navigation example">
      <PaginationItem disabled={currentPage - 1 === 0 ? true : false}>
        <PaginationLink
          className="page-link-first"
          onClick={(ev) => {
            ev.preventDefault();
            firstPage();
          }}
          href="#first"
        >
          <Icon name="chevrons-left" />
        </PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={currentPage - 1 === 0 ? true : false}>
        <PaginationLink
          className="page-link-prev"
          onClick={(ev) => {
            ev.preventDefault();
            prevPage();
          }}
          href="#prev"
        >
          <Icon name="chevron-left" />
        </PaginationLink>
      </PaginationItem>
      {paginationItms.map((item) => {
        return (
          <PaginationItem
            disabled={isNaN(item)}
            className={`d-none d-sm-block ${currentPage === item ? "active" : ""}`}
            key={item}
          >
            <PaginationLink
              tag="a"
              href="#pageitem"
              onClick={(ev) => {
                ev.preventDefault();
                paginate(item);
              }}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        );
      })}
      <PaginationItem disabled={pageNumbers[pageNumbers.length - 1] === currentPage}>
        <PaginationLink
          className="page-link-next"
          onClick={(ev) => {
            ev.preventDefault();
            nextPage();
          }}
          href="#next"
        >
          <Icon name="chevron-right" />
        </PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={pageNumbers[pageNumbers.length - 1] === currentPage}>
        <PaginationLink
          className="page-link-next"
          onClick={(ev) => {
            ev.preventDefault();
            lastPage();
          }}
          href="#last"
        >
          <Icon name="chevrons-right" />
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};
export default PaginationComponent;
