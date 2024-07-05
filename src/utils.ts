import proj4 from "proj4";

proj4.defs('EPSG:2180', '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs +type=crs');

function epsg2180to4326(x: number, y: number): number[] {
    return proj4('EPSG:2180', 'EPSG:4326', [x, y]);
}

function epsg4326to2180(lon: number, lat: number): number[] {
    return proj4('EPSG:4326', 'EPSG:2180', [lon, lat]);
}

function toWGS84(x: number, y: number): number[] {
    const scale = 0.0553833918850661411805986223;
    const offset = [1209745.0812, -259745.172];
    return epsg2180to4326(x * scale + offset[0], y * scale + offset[1]);
}

function fromWGS84(lon: number, lat: number): number[] {
    const scale = 18.055954428996340946249923949044;
    const offset = [1209745.0812 * scale, -259745.172 * scale];
    const coords = epsg4326to2180(lon, lat);
    return [coords[0] * scale - offset[0], coords[1] * scale - offset[1]];
}

export { toWGS84, fromWGS84 }