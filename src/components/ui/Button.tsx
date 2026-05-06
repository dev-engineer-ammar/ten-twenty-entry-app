type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button = ({
  children,
  className = "",
  ...props
}: ButtonProps) => {


  

  return (
    <button
      className={` border-transparent  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};