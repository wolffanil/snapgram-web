import { useTheme } from "../../hooks/useTheme";

function Logo({ className }: { className?: string }) {
  const { isDarkMode } = useTheme();
  return (
    <img
      src={`/assets/images/${isDarkMode ? "logo-dark.svg" : "logo-light.svg"}`}
      alt="logo"
      className={className}
    />
  );
}

export default Logo;
