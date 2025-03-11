// src/app/club-elo/page.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";

export default function ClubEloPage() {
  const [clubEloData, setClubEloData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Default to 50 per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/club-elo");
        if (!response.ok) {
          throw new Error("Failed to fetch ClubElo data");
        }
        const data = await response.json();
        setClubEloData(data);
      } catch (err) {
        setError(err.message || "Failed to load ClubElo data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtered data (without pagination)
  const filteredData = useMemo(() => {
    if (!clubEloData) return [];

    // Apply search filter
    let filteredBySearch = clubEloData.filter((club) =>
      club.Club.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply country filter
    if (selectedCountry !== "All") {
      filteredBySearch = filteredBySearch.filter(
        (club) => club.Country === selectedCountry
      );
    }

    // Sort by Elo in descending order
    return filteredBySearch.sort(
      (a, b) => parseFloat(b.Elo) - parseFloat(a.Elo)
    );
  }, [clubEloData, searchTerm, selectedCountry]);

  // Extract unique countries for filtering
  const uniqueCountries = useMemo(() => {
    if (!clubEloData) return [];
    const countries = new Set(clubEloData.map((club) => club.Country));
    return ["All", ...Array.from(countries)];
  }, [clubEloData]);

  // Pagination Logic (now based on filteredData)
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setCurrentPage(1); // Reset to page 1 when page size changes
  };

  // Reset currentPage to 1 when searchTerm or selectedCountry changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry]);

  if (loading) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-700">
          กำลังโหลดข้อมูล...
        </div>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-red-600">
          ข้อผิดพลาด: {error}
        </div>
        <Footer />
      </Container>
    );
  }

  if (!clubEloData || clubEloData.length === 0) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
          ไม่พบข้อมูลในวันนี้
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <div className="p-6 md:p-10 bg-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          ClubElo Ratings
        </h1>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search by club name..."
            className="input input-bordered w-full md:w-1/3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="w-full md:w-1/4">
            <select
              id="country-filter"
              className="select select-bordered w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option disabled value="All">
                Filter by Country
              </option>
              <option value="All">All</option>
              {uniqueCountries
                .filter((country) => country !== "All")
                .map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Page Size Selector */}
        <div className="mb-6 flex items-center">
          <label htmlFor="page-size" className="mr-4 text-gray-700 text-lg">
            Show per page:
          </label>
          <select
            id="page-size"
            className="select select-bordered text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
          <table className="table table-zebra w-full text-lg">
            {/* Table Header */}
            <thead className="text-gray-700">
              <tr>
                <th className="text-left">Rank</th>
                <th className="text-left">Club</th>
                <th className="text-left">Country</th>
                <th className="text-left">Elo</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {paginatedData.map((club, index) => (
                <tr key={index}>
                  <th>{startIndex + index + 1}</th>
                  <td>{club.Club}</td>
                  <td>{club.Country}</td>
                  <td>{parseFloat(club.Elo).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-md btn-outline"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`btn btn-md btn-outline ${
                  currentPage === i + 1 ? "btn-active" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-md btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </Container>
  );
}
