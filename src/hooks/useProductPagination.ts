
import { useState, useEffect } from 'react';

export const useProductPagination = (totalItems: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page
  
  // Reset to page 1 when totalItems changes
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return {
    currentPage,
    pageSize,
    handlePageChange
  };
};
