import React from "react";

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default:
      "bg-green-400 text-white hover:bg-green-500 focus:ring-green-300",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
    danger:
      "bg-red-400 text-white hover:bg-red-500 focus:ring-red-300",
  };


  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
