import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const getPages = (current, total) => {
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, "...", total);
    } else if (current >= total - 2) {
      pages.push(
        1,
        "...",
        total - 3,
        total - 2,
        total - 1,
        total
      );
    } else {
      pages.push(
        1,
        "...",
        current - 1,
        current,
        current + 1,
        "...",
        total
      );
    }
  }

  return pages;
};

export default function Pagination({
  pageHandler,
  page,
  dynamicPage,
}) {
  return (
    <div className="flex flex-col items-center gap-4 mt-12">

      {/* Page Info */}
      <p className="text-sm text-gray-400 font-medium">
        Page {page} of {dynamicPage}
      </p>

      <div className="flex items-center gap-2">

        {/* Previous Button */}
        <button
          disabled={page === 1}
          onClick={() => pageHandler(page - 1)}
          className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300
            ${
              page === 1
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-500 hover:shadow-md cursor-pointer"
            }`}
        >
          <IoChevronBack size={18} />
        </button>

        {/* Page Numbers */}
        {getPages(page, dynamicPage).map((item, index) => (
          <button
            key={index}
            disabled={item === "..."}
            onClick={() =>
              typeof item === "number" && pageHandler(item)
            }
            className={`min-w-[44px] h-11 px-3 rounded-xl text-sm font-semibold transition-all duration-300
              ${
                item === page
                  ? "bg-red-500 text-white shadow-lg shadow-red-200 scale-105"
                  : item === "..."
                  ? "text-gray-400 cursor-default"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500 hover:shadow-md cursor-pointer"
              }`}
          >
            {item}
          </button>
        ))}

        {/* Next Button */}
        <button
          disabled={page === dynamicPage}
          onClick={() => pageHandler(page + 1)}
          className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300
            ${
              page === dynamicPage
                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-500 hover:shadow-md cursor-pointer"
            }`}
        >
          <IoChevronForward size={18} />
        </button>

      </div>
    </div>
  );
}