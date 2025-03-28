import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './InternshipsPage.css';
import InternshipCard from '../components/InternshipCard';

function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Most relevant');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Dummy data for internships
  const internships = [
    {
      id: 1,
      title: 'Social Media Assistant',
      organization: 'Young Men Christians Association',
      location: 'Addis Ababa, Ethiopia',
      description:
        'As a Social Media Assistant, you will work closely with the social media manager or marketing team to execute social media strategies and campaigns. You will be responsible for assisting in the creation and scheduling of engaging content, monitoring social media channels, and interacting with followers.',
      tags: ['In Person', 'Education', 'IT'],
      postedDate: '2023-07-01',
      deadline: '2023-07-31',
    },
    {
      id: 2,
      title: 'Social Media Assistant',
      organization: 'Young Men Christians Association',
      location: 'Addis Ababa, Ethiopia',
      description:
        'As a Social Media Assistant, you will work closely with the social media manager or marketing team to execute social media strategies and campaigns. You will be responsible for assisting in the creation and scheduling of engaging content, monitoring social media channels, and interacting with followers.',
      tags: ['In Person', 'Education', 'IT'],
      postedDate: '2023-07-05',
      deadline: '2023-08-15',
    },
    {
      id: 3,
      title: 'Volunteer Teacher',
      organization: 'School Under The Tree',
      location: 'Addis Ababa, Ethiopia',
      description:
        'As a Social Media Assistant, you will work closely with the social media manager or marketing team to execute social media strategies and campaigns. You will be responsible for assisting in the creation and scheduling of engaging content, monitoring social media channels, and interacting with followers.',
      tags: ['In Person', 'Education', 'IT'],
      postedDate: '2023-07-10',
      deadline: '2023-08-20',
    },
    {
      id: 4,
      title: 'Social Media Assistant',
      organization: 'The Africa in me',
      location: 'Addis Ababa, Ethiopia',
      description:
        'As a Social Media Assistant, you will work closely with the social media manager or marketing team to execute social media strategies and campaigns. You will be responsible for assisting in the creation and scheduling of engaging content, monitoring social media channels, and interacting with followers.',
      tags: ['In Person', 'Education', 'IT'],
      postedDate: '2023-07-15',
      deadline: '2023-08-25',
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
                {sortedInternships.map((internship) => (
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
          </main>
        </div>
      </div>
    </div>
  );
}

export default InternshipsPage;
