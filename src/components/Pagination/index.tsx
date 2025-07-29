import { useEffect, useState } from "react";
import "./_style.scss";

import SvgArrowLeft from "@/assets/img/icons/ArrowLeft.svg?react";
import SvgArrowDoubleLeft from "@/assets/img/icons/ArrowDoubleLeft.svg?react";
interface IProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  onPageClick: (n: number) => void;
}

const Pagination = ({
  currentPage,
  onPageClick,
  totalPages,
  className,
}: IProps) => {
  const [pages, setPages] = useState<{
    first: number[];
    middle: number[];
    last: number[];
  }>({ first: [], middle: [], last: [] });

  useEffect(() => {
    setPages(() => {
      const first: number[] = [];
      const middle: number[] = [];
      const last: number[] = [];

      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          first.push(i);
        }
      }

      if (totalPages > 5) {
        if (currentPage <= 3) {
          first.push(...[1, 2, 3]);
          if (currentPage === 3) first.push(4);
          last.push(totalPages);
        }

        if (currentPage > totalPages - 3) {
          first.push(1);
          if (currentPage === totalPages - 2) last.push(totalPages - 3);
          last.push(...[totalPages - 2, totalPages - 1, totalPages]);
        }

        if (currentPage > 3 && currentPage <= totalPages - 3) {
          first.push(1);
          last.push(totalPages);
          middle.push(...[currentPage - 1, currentPage, currentPage + 1]);
        }
      }

      return {
        first,
        middle,
        last,
      };
    });
  }, [currentPage, totalPages]);

  return (
    <div className={"component-pagination " + className}>
      <span
        role="button"
        tabIndex={0}
        className={"square " + (currentPage === 1 ? "unavailable" : "")}
        onKeyDown={(e) =>
          e.key === "Enter" ? onPageClick(currentPage - 1) : null
        }
        onClick={() => {
          if (currentPage - 1 > 0) {
            const newPage = 1;
            onPageClick(newPage);
          }
        }}
      >
        <SvgArrowDoubleLeft />
      </span>
      <span
        role="button"
        tabIndex={0}
        className={"square " + (currentPage === 1 ? "unavailable" : "")}
        onKeyDown={(e) =>
          e.key === "Enter" ? onPageClick(currentPage - 1) : null
        }
        onClick={() => {
          if (currentPage - 1 > 0) onPageClick(currentPage - 1);
        }}
      >
        {<SvgArrowLeft />}
      </span>
      <div className="numbers">
        {pages.first.map((p, index) => {
          return (
            <div
              role="button"
              tabIndex={0}
              className={
                "square" + " " + (currentPage === p ? " selected" : "")
              }
              onKeyDown={(e) => (e.key === "Enter" ? onPageClick(p) : null)}
              onClick={() => {
                onPageClick(p);
              }}
              key={"pagination_first_" + index}
            >
              {p}
            </div>
          );
        })}

        {pages.middle.length > 0 && <span className="dots">...</span>}

        {pages.middle.map((p, index) => {
          return (
            <div
              role="button"
              tabIndex={0}
              className={"square" + " " + (currentPage === p ? "selected" : "")}
              onKeyDown={(e) => (e.key === "Enter" ? onPageClick(p) : null)}
              onClick={() => {
                onPageClick(p);
              }}
              key={"pagination_middle_" + index}
            >
              {p}
            </div>
          );
        })}

        {pages.last.length > 0 ? <span className="dots">...</span> : null}

        {pages.last.map((p, index) => {
          return (
            <div
              role="button"
              tabIndex={0}
              className={"square" + " " + (currentPage === p ? "selected" : "")}
              onKeyDown={(e) => (e.key === "Enter" ? onPageClick(p) : null)}
              onClick={() => {
                onPageClick(p);
              }}
              key={"pagination_last_" + index}
            >
              {p}
            </div>
          );
        })}
      </div>
      <span
        role="button"
        tabIndex={0}
        className={
          "square " + (currentPage === totalPages ? "unavailable" : "")
        }
        onKeyDown={(e) =>
          e.key === "Enter" ? onPageClick(currentPage + 1) : null
        }
        onClick={() => {
          if (currentPage + 1 <= totalPages) onPageClick(currentPage + 1);
        }}
      >
        <SvgArrowLeft className="right" />
      </span>
      <span
        role="button"
        tabIndex={0}
        className={
          "square " + (currentPage === totalPages ? "unavailable" : "")
        }
        onKeyDown={(e) =>
          e.key === "Enter" ? onPageClick(currentPage - 1) : null
        }
        onClick={() => {
          if (currentPage + 1 <= totalPages) {
            const newPage = totalPages;
            onPageClick(newPage);
          }
        }}
      >
        <SvgArrowDoubleLeft className="h-mirror" />
      </span>
    </div>
  );
};

export default Pagination;
