async function searchPlace(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&limit=1&featureType=city&polygon_geojson=0&format=jsonv2`;
    const response = await fetch(url);
    const data: unknown = await response.json();
    if (!Array.isArray(data))
        return undefined;
    const item = data[0];
    if (!item) 
        return undefined;
    if (item.lat && item.lon) 
        return [parseFloat(item.lon), parseFloat(item.lat)];
    return undefined;
}

export { searchPlace };