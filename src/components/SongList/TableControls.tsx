import React, { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../../utils/handleClickOutside";

import FilterIcon from "../../assets/filter.svg";

interface TableControlsProps {
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

export const TableControls: React.FC<TableControlsProps> = ({ perPage, setPerPage, setPage }) => {
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(parseInt(e.target.value));
    if (setPage) setPage(1);
  };

  return (
    <div className="table-controls">
      <div>
        <label htmlFor="per-page">Per page:</label>
        <select id="per-page" value={perPage} onChange={handlePerPageChange}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
};

interface PaginationProps {
  page: number;
  inputPage: string;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setInputPage: React.Dispatch<React.SetStateAction<string>>;
  size?: "sm" | "lg";
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  inputPage,
  totalPages,
  setPage,
  setInputPage,
  size = "lg"
}) => {
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handlePageInputUpdate = () => {
    const newPage = parseInt(inputPage, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    } else {
      setInputPage(page.toString());
    }
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageInputUpdate();
    }
  };

  useEffect(() => {
    setInputPage(page.toString());
  }, [page]);

  return (
    <div className="pagination">
      <button
        onClick={handlePrevPage}
        disabled={page === 1}
        className="prev"
      >
        {size === "lg" && "Previous"}
        {size === "sm" && "←"}
      </button>
      <span className="pages">
        {size === "lg" && "Page "} <input
          type="number" 
          value={inputPage} 
          onChange={handlePageInputChange}
          onBlur={handlePageInputUpdate}
          onKeyDown={handlePageInputKeyPress}
          min={1} 
          max={totalPages} 
        /> of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={page === totalPages}
        className="next"
      >
        {size === "lg" && "Next"}
        {size === "sm" && "→"}
      </button>
    </div>
  );
};

interface SearchProps {
  search: string;
  filters: string[];
  filterOptions: { value: string; label: string }[];
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  submitSearch: () => void;
}

export const Search: React.FC<SearchProps> = ({
  search,
  filters,
  filterOptions,
  setSearch,
  setFilters,
  submitSearch
}) => {
  const [filtersToSet, setFiltersToSet] = useState<string[]>(filters);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterToggle = (filter: string) => {
    setFiltersToSet(prevFilters => 
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const handleClearFilters = () => {
    setFiltersToSet([]);
    setFilters([]);
    setIsDropdownOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const handleSearchClick = () => {
    submitSearch();
  };

  const handleDropdownClose = () => {
    setFilters(filtersToSet);
    setIsDropdownOpen(false);
  };

  useClickOutside(dropdownRef, handleDropdownClose);

  return (
    <div className="search-controls">
      <div className="search-input-container">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          placeholder="Search..."
        />
        <button 
          className="filter-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img src={FilterIcon} alt="Filter" />
        </button>
        {isDropdownOpen && (
          <div className="filter-dropdown" ref={dropdownRef}>
            {filterOptions.map(option => (
              <label key={option.value} className="filter-option">
                <input
                  type="checkbox"
                  checked={filtersToSet.includes(option.value)}
                  onChange={() => handleFilterToggle(option.value)}
                />
                {option.label}
              </label>
            ))}
            <button onClick={handleClearFilters} className="clear-filters-button">
              Clear filters
            </button>
          </div>
        )}
      </div>
      <button onClick={handleSearchClick} className="search-button">
        Search
      </button>
    </div>
  );
};