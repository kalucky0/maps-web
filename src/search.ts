export async function searchPlace(query: string): Promise<[number, number] | undefined> {
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&limit=1&featureType=city&polygon_geojson=0&format=jsonv2`;
  const response = await fetch(url);

  const data: unknown = await response.json();

  if (!data || typeof data !== 'object' || !Array.isArray(data)) {
    return undefined;
  }

  if (data.length === 0 || typeof data[0] !== 'object' || data[0] === null) {
    return undefined;
  }

  const item = data[0] as { lat?: string; lon?: string };
  if (typeof item.lat === 'string' && typeof item.lon === 'string') {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      return [lon, lat];
    }
  }

  return undefined;
}
