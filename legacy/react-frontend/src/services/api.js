// API service for Kinsley Law Advocates

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Fetch all attorneys
export const getAttorneys = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attorneys`);
    if (!response.ok) throw new Error('Failed to fetch attorneys');
    return await response.json();
  } catch (error) {
    console.error('Error fetching attorneys:', error);
    throw error;
  }
};

// Fetch attorney by ID
export const getAttorneyById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attorneys/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch attorney with ID ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching attorney ${id}:`, error);
    throw error;
  }
};

// Fetch all practice areas
export const getPracticeAreas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/practice_areas`);
    if (!response.ok) throw new Error('Failed to fetch practice areas');
    return await response.json();
  } catch (error) {
    console.error('Error fetching practice areas:', error);
    throw error;
  }
};

// Fetch practice area by ID
export const getPracticeAreaById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/practice_areas/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch practice area with ID ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching practice area ${id}:`, error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointment: appointmentData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to create appointment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Submit contact form
export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contact: contactData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to submit contact form');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};
