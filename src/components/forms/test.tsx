import React, { useState, FormEvent } from 'react';
import { TextInput, PasswordInput } from '.';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// 18.237.22.217
function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form is valid', formData);
      // Submit form
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput 
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter your email"
      />
      
      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Enter your password"
      />

      <button 
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;