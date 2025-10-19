// src/components/Pagination.jsx
const Pagination = ({ page, setPage, totalProducts, productsPerPage }) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-gray-700 text-sm">
        Page {page} of {totalPages} ({totalProducts} total products)
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;