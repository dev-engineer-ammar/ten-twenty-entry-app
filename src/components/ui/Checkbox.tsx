import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = ({ className = "", ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 accent-blue-600 cursor-pointer ${className}`}
      {...props}
    />
  );
};