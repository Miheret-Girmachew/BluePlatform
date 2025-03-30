import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./InternshipsPage.css";
import InternshipCard from "../components/InternshipCard";

function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Most relevant");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 10; // Adjust this number to configure the number of internships per page

  // Dummy data for internships
  const internships = [
    {
      id: 1,
      title: "Social Media Assistant",
      organization: "Ethiopian Agricultural Transformation Agency (ATA)",
      location: "Addis Ababa, Ethiopia",
      description:
        "Assist in managing social media platforms, creating content in Amharic/English, and engaging with local communities to promote youth programs.",
      tags: ["In Person", "Education", "IT"],
      postedDate: "2023-07-01",
      deadline: "2023-07-31",
    },
    {
      id: 2,
      title: "Community Volunteer Teacher",
      organization: "Addis Ababa Education Bureau",
      location: "Addis Ababa, Ethiopia",
      description:
        "Teach basic literacy and numeracy to underserved children in community centers. Fluency in Amharic or Oromo required.",
      tags: ["In Person", "Volunteer", "Education"],
      postedDate: "2023-07-05",
      deadline: "2023-08-15",
    },
    {
      id: 3,
      title: "Agriculture Extension Intern",
      organization: "Ethiopian Agricultural Transformation Agency (ATA)",
      location: "Oromia Region, Ethiopia",
      description:
        "Support smallholder farmers with modern farming techniques and record-keeping. Fieldwork involved.",
      tags: ["In Person", "Agriculture", "Rural"],
      postedDate: "2023-07-10",
      deadline: "2023-08-20",
    },
    {
      id: 4,
      title: "Public Health Intern",
      organization: "Ethiopian Red Cross Society",
      location: "Dire Dawa, Ethiopia",
      description:
        "Assist in health awareness campaigns (HIV, malaria) and community outreach programs.",
      tags: ["In Person", "Health", "Community"],
      postedDate: "2023-07-15",
      deadline: "2023-08-25",
    },
    {
      id: 5,
      title: "Graphic Design Intern",
      organization: "Qene Technologies",
      location: "Addis Ababa, Ethiopia",
      description:
        "Design visuals for Ethiopian startups, including branding materials in local languages.",
      tags: ["Hybrid", "Design", "Creative"],
      postedDate: "2023-07-20",
      deadline: "2023-08-30",
    },
    {
      id: 6,
      title: "Tourism Guide Trainee",
      organization: "Ethiopian Heritage Trust",
      location: "Lalibela, Ethiopia",
      description:
        "Receive training to guide tourists at UNESCO World Heritage sites. Knowledge of Ethiopian history preferred.",
      tags: ["In Person", "Tourism", "Hospitality"],
      postedDate: "2023-07-25",
      deadline: "2023-09-05",
    },
    {
      id: 7,
      title: "Renewable Energy Intern",
      organization: "Ethio Green Power Initiative",
      location: "Bahir Dar, Ethiopia",
      description:
        "Support solar/wind energy projects in rural communities. Engineering students encouraged.",
      tags: ["In Person", "Engineering", "Sustainability"],
      postedDate: "2023-08-01",
      deadline: "2023-09-10",
    },
    {
      id: 8,
      title: "Microfinance Research Assistant",
      organization: "Dashen Bank Community Program",
      location: "Hawassa, Ethiopia",
      description:
        "Collect data on microfinance impacts for women-led small businesses in the Sidama region.",
      tags: ["Research", "Finance", "Fieldwork"],
      postedDate: "2023-08-05",
      deadline: "2023-09-15",
    },
    {
      id: 9,
      title: "Cultural Documentation Volunteer",
      organization: "Ethiopian Folklore Archives",
      location: "Gondar, Ethiopia",
      description:
        "Record oral histories and traditions from local communities. Amharic translation skills needed.",
      tags: ["Volunteer", "Culture", "Language"],
      postedDate: "2023-08-10",
      deadline: "2023-09-20",
    },
    {
      id: 10,
      title: "Urban Planning Intern",
      organization: "Addis Ababa City Administration",
      location: "Addis Ababa, Ethiopia",
      description:
        "Assist in mapping and data collection for city infrastructure projects.",
      tags: ["In Person", "Engineering", "Government"],
      postedDate: "2023-08-15",
      deadline: "2023-09-25",
    },
  ];

  // Get all unique categories and locations for filters
  const allCategories = [...new Set(internships.flatMap(internship => internship.tags))];
  const allLocations = [...new Set(internships.map(internship => internship.location))];

  // Filter internships based on search term and selected filters
  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategories = selectedCategories.length === 0 ||
      internship.tags.some(tag => selectedCategories.includes(tag));

    const matchesLocations = selectedLocations.length === 0 ||
      selectedLocations.includes(internship.location);

    return matchesSearch && matchesCategories && matchesLocations;
  });

  // Sort internships based on selected option
  const sortedInternships = [...filteredInternships].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.postedDate) - new Date(a.postedDate);
    } else if (sortBy === 'Oldest') {
      return new Date(a.postedDate) - new Date(b.postedDate);
    } else if (sortBy === 'Deadline (soonest)') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else {
      return 0; // Most Relevant (no change in order)
    }
  });

  // Pagination logic
  const indexOfLastInternship = currentPage * internshipsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
  const currentInternships = sortedInternships.slice(indexOfFirstInternship, indexOfLastInternship);

  const totalPages = Math.ceil(sortedInternships.length / internshipsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Function to handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Function to handle location filter change
  const handleLocationChange = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSortBy('Most relevant');
  };

  return (
    <div className="internships-page">
      <div className="internships-container">
        <div className="back-to-home">
          <Link to="/" className="back-link">
            ← Back
          </Link>
        </div>

        <header className="page-header">
          <h1 className="page-title">Explore Opportunities</h1>
          <p className="page-subtitle">Find the perfect internship or volunteer opportunity to match your skills and interests</p>
        </header>

        <div className="search-section">
          <div className="search-container">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Search by title, organization, or keywords..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                ×
              </button>
            )}
          </div>
        </div>

        <div className="internships-content">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h2>Filters</h2>
              {(selectedCategories.length > 0 || selectedLocations.length > 0) && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>

            <div className="filter-group">
              <h3>Categories</h3>
              <div className="filter-options">
                {allCategories.map(category => (
                  <label key={category} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="checkmark"></span>
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Location</h3>
              <div className="filter-options">
                {allLocations.map(location => (
                  <label key={location} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationChange(location)}
                    />
                    <span className="checkmark"></span>
                    {location}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="internships-main">
            <div className="internships-header">
              <div className="results-count">
                Showing <span>{sortedInternships.length}</span> opportunities
              </div>
              <div className="sort-controls">
                <label htmlFor="sort-by">Sort by:</label>
                <select id="sort-by" value={sortBy} onChange={handleSortChange} className="sort-select">
                  <option>Most relevant</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Deadline (soonest)</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedLocations.length > 0) && (
              <div className="active-filters">
                <span className="active-filters-label">Active filters:</span>
                <div className="filter-tags">
                  {selectedCategories.map(category => (
                    <span key={category} className="filter-tag">
                      {category}
                      <button onClick={() => handleCategoryChange(category)}>×</button>
                    </span>
                  ))}
                  {selectedLocations.map(location => (
                    <span key={location} className="filter-tag location-tag">
                      {location}
                      <button onClick={() => handleLocationChange(location)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Internships List */}
            {sortedInternships.length > 0 ? (
              <div className="internships-grid">
                {currentInternships.map((internship) => (
                  <Link to={`/internships/${internship.id}`} key={internship.id} className="internship-link">
                    <InternshipCard internship={internship} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon"></div>
                <h3>No opportunities found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button className="reset-search-btn" onClick={clearFilters}>
                  Reset all filters
                </button>
              </div>
            )}

            {/* Pagination Component */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn prev-btn"
              >
                Prev
              </button>

              {/* Generate page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-btn next-btn"
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default InternshipsPage;