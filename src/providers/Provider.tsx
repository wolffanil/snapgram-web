import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import AuthProvider from "../context/auth/AuthProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          margin: "8px",
        }}
        toastOptions={{
          style: {
            fontSize: "13px",
            maxWidth: "500px",
            padding: "14px 20px",
            backgroundColor: "#877eff",
            color: "white",
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default Provider;
