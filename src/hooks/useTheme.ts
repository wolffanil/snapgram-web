import { useContext } from "react";
import { ThemeContext } from "../context/theme/ThemeProvider";

export const useTheme = () => useContext(ThemeContext);
