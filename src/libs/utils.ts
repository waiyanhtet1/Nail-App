export async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const fileType = blob.type || "image/png";
  return new File([blob], filename, { type: fileType });
}
