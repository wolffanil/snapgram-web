export function getErrorMessage(stackTrace: string): string {
  const error = stackTrace.toString().split("at")[0].split("Error: ")[1];

  return error;
}
