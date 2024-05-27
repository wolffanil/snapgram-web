import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import AuthProvider from "../context/auth/AuthProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ThemeProvider from "../context/theme/ThemeProvider";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <AuthProvider>{children}</AuthProvider>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{
            margin: "8px",
          }}
          toastOptions={{
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "#E5DBD0",
              color: "black",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Provider;
