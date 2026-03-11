export function assetPath(relativePath: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalizedBase = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${normalizedBase}${path}`;
}
