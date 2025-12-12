export const validate = {
  phone: (phone: string): string | null => {
    if (!phone) return 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(phone)) return 'Invalid phone number';
    return null;
  },

  otp: (otp: string): string | null => {
    if (!otp) return 'OTP is required';
    if (!/^\d{6}$/.test(otp)) return 'OTP must be 6 digits';
    return null;
  },

  aadhaar: (aadhaar: string): string | null => {
    if (!aadhaar) return 'Aadhaar number is required';
    if (!/^\d{12}$/.test(aadhaar)) return 'Aadhaar must be 12 digits';
    return null;
  },

  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return null;
  },

  email: (email: string): string | null => {
    if (!email) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email';
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value.length < min)
      return `${fieldName} must be at least ${min} characters`;
    return null;
  },
};
