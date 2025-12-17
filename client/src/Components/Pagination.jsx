const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNext, hasPrev } = pagination;
  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <button
        disabled={!hasPrev}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          hasPrev
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Previous
      </button>
      <span className="text-gray-700 font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          hasNext
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
