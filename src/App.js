import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AutocompleteSearch from './components/AutocompleteSearch';
import FilterPanel from './components/FilterPanel';
import DoctorCard from './components/DoctorCard';
import { fetchDoctors } from './services/api';
import {
  applyFilters,
  sortDoctors,
  getTopSuggestions,
  parseQueryParams,
  updateQueryParams,
} from './utils';
import './App.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for filters
  const [nameFilter, setNameFilter] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch doctors data
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        console.log("Fetching doctors data...");
        const data = await fetchDoctors();
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }
        console.log(`Received ${data.length} doctors`);
        setDoctors(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading doctors:", err);
        setError(err.message || "Failed to load doctors data");
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Parse URL query params on initial load
  useEffect(() => {
    if (doctors.length === 0) return;

    const params = parseQueryParams(searchParams);
    
    if (params.name) {
      setNameFilter(params.name);
    }
    
    if (params.consultationType) {
      setConsultationType(params.consultationType);
    }
    
    if (params.specialties) {
      setSelectedSpecialties(params.specialties);
    }
    
    if (params.sortBy) {
      setSortBy(params.sortBy);
    }
  }, [doctors, searchParams]);

  // Apply filters and sorting whenever state changes
  useEffect(() => {
    if (doctors.length === 0) return;

    let result = applyFilters(doctors, {
      name: nameFilter,
      consultationType,
      specialties: selectedSpecialties,
    });

    if (sortBy) {
      result = sortDoctors(result, sortBy);
    }

    setFilteredDoctors(result);
  }, [doctors, nameFilter, consultationType, selectedSpecialties, sortBy]);

  // Update search suggestions
  useEffect(() => {
    if (nameFilter && doctors.length > 0) {
      setSuggestions(getTopSuggestions(doctors, nameFilter));
    } else {
      setSuggestions([]);
    }
  }, [nameFilter, doctors]);

  // Get all unique specialties from doctors data
  const allSpecialties = [...new Set(doctors.flatMap(doctor => 
    Array.isArray(doctor.specialties) ? doctor.specialties : []
  ))].sort();

  // Handler functions
  const handleNameFilterChange = (value) => {
    setNameFilter(value);
    updateQueryParams({
      name: value,
      consultationType,
      specialties: selectedSpecialties,
      sortBy,
    }, navigate);
  };

  const handleSuggestionSelect = (suggestion) => {
    setNameFilter(suggestion);
    updateQueryParams({
      name: suggestion,
      consultationType,
      specialties: selectedSpecialties,
      sortBy,
    }, navigate);
  };

  const handleConsultationTypeChange = (type) => {
    setConsultationType(type);
    updateQueryParams({
      name: nameFilter,
      consultationType: type,
      specialties: selectedSpecialties,
      sortBy,
    }, navigate);
  };

  const handleSpecialtyToggle = (specialty) => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty];
    
    setSelectedSpecialties(newSpecialties);
    updateQueryParams({
      name: nameFilter,
      consultationType,
      specialties: newSpecialties,
      sortBy,
    }, navigate);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    updateQueryParams({
      name: nameFilter,
      consultationType,
      specialties: selectedSpecialties,
      sortBy: sortType,
    }, navigate);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Doctors...</h2>
        <p>Please wait while we fetch the latest doctor information</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <p>Please try refreshing the page or check your network connection</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="app">
      <header className="app-header">
        <h1>Find Doctors</h1>
        <AutocompleteSearch
          value={nameFilter}
          onChange={handleNameFilterChange}
          suggestions={suggestions}
          onSelectSuggestion={handleSuggestionSelect}
        />
      </header>

      <div className="app-content">
        <FilterPanel
          consultationType={consultationType}
          onConsultationTypeChange={handleConsultationTypeChange}
          specialties={allSpecialties}
          selectedSpecialties={selectedSpecialties}
          onSpecialtyToggle={handleSpecialtyToggle}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        <div className="doctor-list">
          {filteredDoctors.length === 0 ? (
            <div className="no-results">
              No doctors found matching your criteria.
              {doctors.length > 0 && (
                <button onClick={() => {
                  setNameFilter('');
                  setConsultationType('');
                  setSelectedSpecialties([]);
                  setSortBy('');
                }}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;