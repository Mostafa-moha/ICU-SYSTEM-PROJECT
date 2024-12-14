// utils/validation.js
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
  
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;  // Simple validation for a 10-digit phone number
  return phoneRegex.test(phone);
};

const validateRequired = (value) => {
  return value && value.trim().length > 0;
};
  
const validateAge = (age, min = 18, max = 120) => {
  if (age < 18) return 'Age must be 18 or older';
  if (age > 120) return 'Age cannot exceed 120';
  return true;
};


const validateCondition = (condition) => {
  const validConditions = [
    'ARDS',
    'Heart Attack',
    'Sepsis',
    'AKI',
    'Stroke',
    'Cardiac Arrest',
    'TBI',
    'Heart Failure',
    'Pneumonia',
    'COPD Exacerbation',
    'Arrhythmias',
    'Post-Op Recovery',
    'Pancreatitis',
    'DKA',
    'Septic Shock'
  ];

  return validConditions.includes(condition);
};

// Validation for missing or incomplete data
const validateMissingFields = (patient) => {
  if (!validateRequired(patient.name)) return 'Name is required';
  if (!validateRequired(patient.condition)) return 'Condition is required';
  if (!validateRequired(patient.contactNumber)) return 'Contact number is required';
  return null;
};


// General validation for patient input
const validatePatientInput = (patient) => {
  // First, check for missing fields
  const missingFieldError = validateMissingFields(patient);
  if (missingFieldError) return missingFieldError;

  // Then, perform other validations
  if (!validateAge(patient.age)) return 'Age should be between 18 and 120';
  if (!validatePhoneNumber(patient.contactNumber)) return 'Invalid phone number';
  if (patient.email && !validateEmail(patient.email)) return 'Invalid email address';
  return null;
};
  
// You can add more specific validation functions here as needed

module.exports = {
  validateEmail,
  validatePhoneNumber,
  validateRequired,
  validateAge,
  validatePatientInput,
  validateCondition
};
  