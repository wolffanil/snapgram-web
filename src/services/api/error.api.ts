export const errorCatch = (error: any): string => {
  let message = error?.response?.data?.message;

  message
    ? typeof error.response.data.message === "object"
      ? message[0]
      : message
    : error.message;

  throw new Error(message);
};
