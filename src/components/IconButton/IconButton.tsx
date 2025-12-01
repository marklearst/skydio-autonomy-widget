export interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  variant?: "default" | "danger" | "primary";
}

const variantClasses = {
  default: "bg-gray-700 hover:bg-gray-600",
  danger: "bg-red-700 hover:bg-red-600",
  primary: "bg-blue-700 hover:bg-blue-600",
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  variant = "default",
}) => (
  <button
    className={`rounded p-2 transition-colors ${variantClasses[variant]}`}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    {icon}
  </button>
);

export default IconButton;
