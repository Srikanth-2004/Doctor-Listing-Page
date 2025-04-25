export const fetchDoctors = async () => {
  try {
    // First try local file
    const localResponse = await fetch('/doctors.json');
    if (localResponse.ok) {
      const localData = await localResponse.json();
      return localData.map(doctor => transformDoctorData(doctor));
    }
    
    // Fallback to external API
    const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? 
      data.map(doctor => transformDoctorData(doctor)) : 
      [transformDoctorData(data)];
    
  } catch (error) {
    console.error('Error in fetchDoctors:', error);
    console.log('Using mock data instead');
  }
};

// ... keep the transformDoctorData and getMockDoctors functions from above

function transformDoctorData(doctor) {
  return {
    id: doctor.id || Math.random().toString(36).substring(2, 9),
    name: doctor.name || "Unknown Doctor",
    specialties: Array.isArray(doctor.specialities) ? 
      doctor.specialities.map(s => s.name) : 
      ['General'],
    experience: parseInt(doctor.experience) || 0,
    fee: parseInt(doctor.fees?.replace(/[^0-9]/g, '') || 0),
    video_consultation: Boolean(doctor.video_consult),
    in_clinic: Boolean(doctor.in_clinic)
  };
}
