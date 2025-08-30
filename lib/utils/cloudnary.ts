export function getOptimizedImage(url: string, width = 800, height = 500) {
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // Transformation: width, crop/fill, automatic quality & format
  const transformation = `w_${width},h_${height},c_fill,q_auto,f_auto`;
  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
}