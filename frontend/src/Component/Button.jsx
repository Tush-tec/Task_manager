const Button = ({
    children,
    type = "button",
    onClick,
    disabled,
  }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-xl font-semibold text-white transition
          ${disabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
        `}
      >
        {children}
      </button>
    );
  };
  

export default Button