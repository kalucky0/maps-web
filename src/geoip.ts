export async function locateUser(): Promise<[number, number] | undefined> {
  const response = await fetch('https://geoip.kalucky0.dev/');
  if (!response.ok) return undefined;

  const data: unknown = await response.json();

  if (
    typeof data !== 'object' ||
    data === null ||
    !('latitude' in data) ||
    !('longitude' in data)
  ) {
    return undefined;
  }

  const { latitude, longitude } = data;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return undefined;
  }

  return [longitude, latitude];
}
