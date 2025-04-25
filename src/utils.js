// Filter doctors based on criteria
export const applyFilters = (doctors, filters) => {
  if (!Array.isArray(doctors)) {
    console.error("applyFilters: Expected doctors array but got", typeof doctors);
    return [];
  }

  let filteredDoctors = [...doctors];

  // Name filter
  if (typeof filters.name === 'string' && filters.name.trim()) {
    const searchTerm = filters.name.toLowerCase().trim();
    filteredDoctors = filteredDoctors.filter(doctor => 
      typeof doctor.name === 'string' && 
      doctor.name.toLowerCase().includes(searchTerm)
    );
  }

  // Consultation type filter
  if (typeof filters.consultationType === 'string') {
    filteredDoctors = filteredDoctors.filter(doctor => {
      if (filters.consultationType === 'video') {
        return doctor.video_consultation === true;
      } else if (filters.consultationType === 'clinic') {
        return doctor.in_clinic === true;
      }
      return true;
    });
  }

  // Specialties filter
  if (Array.isArray(filters.specialties)) {
    filteredDoctors = filteredDoctors.filter(doctor => {
      if (!Array.isArray(doctor.specialties)) return false;
      return filters.specialties.every(specialty => 
        doctor.specialties.includes(specialty)
      );
    });
  }

  return filteredDoctors;
};

// Sort doctors array
export const sortDoctors = (doctors, sortBy) => {
  if (!Array.isArray(doctors)) return [];
  
  const sortedDoctors = [...doctors];
  
  switch (sortBy) {
    case 'fees':
      sortedDoctors.sort((a, b) => (a.fee || 0) - (b.fee || 0));
      break;
    case 'experience':
      sortedDoctors.sort((a, b) => (b.experience || 0) - (a.experience || 0));
      break;
    default:
      // No sorting or unknown sortBy value
      break;
  }
  
  return sortedDoctors;
};

// Get search suggestions
export const getTopSuggestions = (doctors, query, limit = 3) => {
  if (!Array.isArray(doctors) || typeof query !== 'string' || !query.trim()) {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return doctors
    .filter(doctor => 
      typeof doctor.name === 'string' &&
      doctor.name.toLowerCase().includes(searchTerm))
    .slice(0, limit)
    .map(doctor => doctor.name);
};

// Parse URL query parameters
export const parseQueryParams = (searchParams) => {
  const params = {};
  
  try {
    if (searchParams.get('name')) {
      params.name = searchParams.get('name');
    }
    
    if (searchParams.get('consultationType')) {
      params.consultationType = searchParams.get('consultationType');
    }
    
    if (searchParams.get('specialties')) {
      params.specialties = searchParams.get('specialties').split(',').filter(Boolean);
    }
    
    if (searchParams.get('sortBy')) {
      params.sortBy = searchParams.get('sortBy');
    }
  } catch (error) {
    console.error("Error parsing query params:", error);
  }
  
  return params;
};

// Update URL query parameters
export const updateQueryParams = (params, navigate) => {
  const queryParams = new URLSearchParams();
  
  try {
    if (typeof params.name === 'string' && params.name.trim()) {
      queryParams.set('name', params.name.trim());
    }
    
    if (params.consultationType === 'video' || params.consultationType === 'clinic') {
      queryParams.set('consultationType', params.consultationType);
    }
    
    if (Array.isArray(params.specialties) && params.specialties.length > 0) {
      queryParams.set('specialties', params.specialties.join(','));
    }
    
    if (params.sortBy === 'fees' || params.sortBy === 'experience') {
      queryParams.set('sortBy', params.sortBy);
    }
    
    navigate(`?${queryParams.toString()}`, { replace: true });
  } catch (error) {
    console.error("Error updating query params:", error);
  }
};