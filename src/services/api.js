export const fetchDoctors = async () => {
  try {
    const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';
    console.log(`Fetching data from: ${API_URL}`);
    
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error("Expected array of doctors but got different data structure");
    }
    
    // Basic validation of doctor objects
    const validatedData = data.map(doctor => {
      if (!doctor.id || !doctor.name) {
        console.warn("Invalid doctor data:", doctor);
      }
      return {
        id: doctor.id || Math.random().toString(36).substring(2, 9),
        name: doctor.name || "Unknown Doctor",
        specialties: Array.isArray(doctor.specialties) ? doctor.specialties : [],
        experience: typeof doctor.experience === 'number' ? doctor.experience : 0,
        fee: typeof doctor.fee === 'number' ? doctor.fee : 0,
        video_consultation: Boolean(doctor.video_consultation),
        in_clinic: Boolean(doctor.in_clinic)
      };
    });
    
    console.log(`Successfully fetched ${validatedData.length} doctors`);
    return validatedData;
  } catch (error) {
    console.error('Error in fetchDoctors:', error);
    throw new Error(`Failed to fetch doctors: ${error.message}`);
  }
};