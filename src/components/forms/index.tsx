import React, { useState, forwardRef, ComponentProps, ReactNode } from 'react';
import { Eye, EyeOff, Search, Calendar } from 'lucide-react';

// Common props interface for all inputs
interface BaseInputProps extends Omit<ComponentProps<'input'>, 'ref'> {
  label: string;
  error?: string;
  className?: string;
}

// Input wrapper props
interface InputWrapperProps {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

// Select option type
interface SelectOption {
  value: string;
  label: string;
}

// Select props
interface SelectProps extends Omit<ComponentProps<'select'>, 'ref'> {
  label: string;
  error?: string;
  options: SelectOption[];
  className?: string;
}

// Toggle props
interface ToggleProps extends Omit<ComponentProps<'input'>, 'ref' | 'type'| 'onChange'> {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

// Input wrapper component
const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>(({
  children,
  label,
  error,
  className = ""
}, ref) => {
  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
});

InputWrapper.displayName = 'InputWrapper';

// Text Input
export const TextInput = forwardRef<HTMLInputElement, BaseInputProps>(({
  label,
  error,
  className = "",
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper label={label} error={error}>
      <input
        ref={ref}
        type="text"
        aria-invalid={`${!!error}`}
        className={`
          w-full px-4 py-2 border rounded-md
          transition-all duration-200
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
          focus:outline-none
          ${className}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </InputWrapper>
  );
});

TextInput.displayName = 'TextInput';

// Password Input
export const PasswordInput = forwardRef<HTMLInputElement, BaseInputProps>(({
  label,
  error,
  className = "",
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper label={label} error={error}>
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          aria-invalid={`${!!error}`}
          className={`
            w-full px-4 py-2 pr-10 border rounded-md
            transition-all duration-200
            ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
            ${error ? 'border-red-500' : ''}
            focus:outline-none
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </InputWrapper>
  );
});

PasswordInput.displayName = 'PasswordInput';

// Search Input
export const SearchInput = forwardRef<HTMLInputElement, BaseInputProps>(({
  label,
  error,
  className = "",
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper label={label} error={error}>
      <div className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={ref}
          type="search"
          aria-invalid={`${!!error}`}
          className={`
            w-full pl-10 pr-4 py-2 border rounded-md
            transition-all duration-200
            ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
            ${error ? 'border-red-500' : ''}
            focus:outline-none
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
    </InputWrapper>
  );
});

SearchInput.displayName = 'SearchInput';

// TextArea
export const TextArea = forwardRef<HTMLTextAreaElement, Omit<ComponentProps<'textarea'>, 'ref'> & {
  label: string;
  error?: string;
  className?: string;
}>(({
  label,
  error,
  className = "",
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper label={label} error={error}>
      <textarea
        ref={ref}
        aria-invalid={`${!!error}`}
        className={`
          w-full px-4 py-2 border rounded-md
          transition-all duration-200
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
          focus:outline-none
          resize-y min-h-[100px]
          ${className}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </InputWrapper>
  );
});

TextArea.displayName = 'TextArea';

// Select Input
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className = "",
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper label={label} error={error}>
      <select
        ref={ref}
        aria-invalid={`${!!error}`}
        className={`
          w-full px-4 py-2 border rounded-md
          transition-all duration-200
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
          focus:outline-none
          ${className}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </InputWrapper>
  );
});

Select.displayName = 'Select';

// Checkbox
export const Checkbox = forwardRef<HTMLInputElement, Omit<BaseInputProps, 'type'>>(({
  label,
  error,
  className = "",
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <input
        ref={ref}
        type="checkbox"
        aria-invalid={`${!!error}`}
        className={`
          w-4 h-4 border rounded
          transition-all duration-200
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
          focus:outline-none
          ${className}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {error && (
        <p className="ml-2 text-sm text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// Toggle Switch
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({
  label,
  checked,
  onChange,
  className = "",
  ...props
}, ref) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          {...props}
        />
        <div
          className={`
            w-10 h-6 bg-gray-200 rounded-full 
            transition-colors duration-200 ease-in-out
            ${checked ? 'bg-blue-500' : ''}
            ${className}
          `}
        >
          <div
            className={`
              absolute top-1 left-1 w-4 h-4 bg-white rounded-full 
              transition-transform duration-200 ease-in-out
              ${checked ? 'transform translate-x-4' : ''}
            `}
          />
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
});

Toggle.displayName = 'Toggle';

// Date Input
export const DateInput = forwardRef<HTMLInputElement, BaseInputProps>(({
  label,
  error,
  className = "",
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper label={label} error={error}>
      <div className="relative">
        <Calendar
          size={18}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={ref}
          type="date"
          aria-invalid={`${!!error}`}
          className={`
            w-full pl-10 pr-4 py-2 border rounded-md
            transition-all duration-200
            ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
            ${error ? 'border-red-500' : ''}
            focus:outline-none
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
    </InputWrapper>
  );
});

DateInput.displayName = 'DateInput';

export type {
  BaseInputProps,
  SelectProps,
  SelectOption,
  ToggleProps,
  InputWrapperProps,
};

export default {
  TextInput,
  PasswordInput,
  SearchInput,
  TextArea,
  Select,
  Checkbox,
  Toggle,
  DateInput,
};