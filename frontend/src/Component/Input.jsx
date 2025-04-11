const Input = ({
    type,
    name,
    value,
    placeholder,
    onChange,
    autoComplete,
    required = true,
  }) => {
    return (
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )
  }
  

export default Input