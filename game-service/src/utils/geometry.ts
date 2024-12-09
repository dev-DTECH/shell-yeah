export function cartesianToGeographic(x: number, y: number): { longitude: number; latitude: number } {
    const earthRadius = 6378137;

    // Convert x, y to longitude and latitude relative to (0, 0) with scale factor of 1
    const longitude = (x / earthRadius) * (180 / Math.PI);
    const latitude = (y / earthRadius) * (180 / Math.PI);

    return { longitude, latitude };
}

export function geographicToCartesian(longitude: number, latitude: number): { x: number; y: number } {
    const earthRadius = 6378137;

    // Convert longitude and latitude to x, y relative to (0, 0) with scale factor of 1
    const x = longitude * (Math.PI / 180) * earthRadius;
    const y = latitude * (Math.PI / 180) * earthRadius;

    return { x, y };
}