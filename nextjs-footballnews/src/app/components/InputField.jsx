import React from "react";

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = "",
  required,
  name,
}) => {
  return (
    <div className="mb-4 relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        name={name}
        type={type}
        className={`w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xl focus:outline-none focus:border-indigo-400 focus:bg-white ${
          icon ? "pl-10" : "pl-4"
        } ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
