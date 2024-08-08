import React, { useEffect } from "react";
import { Row, Col, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import Icon from "../icon/Icon";

const DataTablePagination = ({
  itemPerPage,
  totalItems,
  paginate,
  currentPage,
  onChangeRowsPerPage,
  customItemPerPage,
  setRowsPerPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemPerPage);

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

  const pageNumbers = getPageNumbers();

  const firstPage = () => {
    paginate(1);
  };

  const lastPage = () => {
    paginate(totalPages);
  };

  const nextPage = () => {
    paginate(currentPage + 1);
  };

  const prevPage = () => {
    paginate(currentPage - 1);
  };

  useEffect(() => {
    onChangeRowsPerPage(customItemPerPage);
  }, [customItemPerPage, onChangeRowsPerPage]);

  return (
    <Row className="align-items-center">
      <Col className="col-7" sm="12" md="12">
        <div className="d-flex ">
          <Pagination aria-label="Page navigation example" className="me-2">
            <PaginationItem disabled={currentPage === 1}>
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
            <PaginationItem disabled={currentPage === 1}>
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

            {pageNumbers.map((item) => {
              return (
                <PaginationItem
                  style={{ pointerEvents: currentPage === item ? "none" : "auto" }}
                  className={`d-none d-sm-block ${currentPage === item ? "active" : ""}`}
                  key={item}
                >
                  <PaginationLink
                    tag="a"
                    href="#pageitem"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setCurrentPage(item);
                      paginate(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem disabled={currentPage === totalPages}>
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
            <PaginationItem disabled={currentPage === totalPages}>
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

          <div className="dataTables_info" id="DataTables_Table_2_info" role="status" aria-live="polite">
            {itemPerPage * (currentPage - 1) + 1} - {Math.min(itemPerPage * currentPage, totalItems)} of {totalItems}
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default DataTablePagination;
