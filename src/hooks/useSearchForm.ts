import { useForm } from "react-hook-form";
import { useDebounce } from "./useDebounce";
import { useMemo } from "react";

interface ISerchFormData {
  searchTerm: string;
}

export const useSearchForm = () => {
  const { control, watch } = useForm<ISerchFormData>({
    mode: "onChange",
    defaultValues: {
      searchTerm: "",
    },
  });

  const searchTerm = watch("searchTerm");
  const debouncedValue = useDebounce(searchTerm, 300);

  return useMemo(
    () => ({
      debouncedValue,
      searchTerm,
      control,
    }),
    [searchTerm]
  );
};
