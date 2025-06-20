export const getOffsetCoordinates = (center, distanceMeters = 1000) => {
    const R = 6378137; // Dünya yarıçapı (metre)
    const dLat = distanceMeters / R;
    const dLng = distanceMeters / (R * Math.cos((Math.PI * center.lat) / 180));

    return {
        north: { lat: center.lat + (dLat * 180) / Math.PI, lng: center.lng },
        south: { lat: center.lat - (dLat * 180) / Math.PI, lng: center.lng },
        east: { lat: center.lat, lng: center.lng + (dLng * 180) / Math.PI },
        west: { lat: center.lat, lng: center.lng - (dLng * 180) / Math.PI }
    };
};

export const findEdges = (longitude, latitude, distance = 1, type) => {
    const earthRadius = 6371; // Dünya yarıçapı (km)

    // Latitude için 1 km yaklaşık olarak 1 / 110.574 derece
    const latDelta = distance / 110.574;

    // Longitude için 1 km yaklaşık olarak 1 / (111.320 * cos(latitude)) derece
    const lonDelta = distance / (111.32 * Math.cos(latitude * (Math.PI / 180)));

    const lat_max = latitude + latDelta;
    const lat_min = latitude - latDelta;
    const lon_max = longitude + lonDelta;
    const lon_min = longitude - lonDelta;

    return {
        north: { lat: lat_max, lng: longitude },
        south: { lat: lat_min, lng: longitude },
        east: { lat: latitude, lng: lon_max },
        west: { lat: latitude, lng: lon_min },
        bounds: {
            lat_min,
            lat_max,
            lon_min,
            lon_max
            
        }
    };
};

export function createSquarePolygonFromCenter(lat, lng, size = 50) {
    const earthRadius = 6378137; // metre
    const dLat = size / 2 / earthRadius;
    const dLng = size / 2 / (earthRadius * Math.cos((Math.PI * lat) / 180));

    const latOffset = (dLat * 180) / Math.PI;
    const lngOffset = (dLng * 180) / Math.PI;

    return [
        [lng - lngOffset, lat - latOffset], // bottom-left
        [lng + lngOffset, lat - latOffset], // bottom-right
        [lng + lngOffset, lat + latOffset], // top-right
        [lng - lngOffset, lat + latOffset], // top-left
        [lng - lngOffset, lat - latOffset] // close polygon
    ];
}

export const KPI_COLORS = {
    rsrp: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'],
    // rsrp: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00'],
    rsrq: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'],
    avg_dl_throughput: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'],
    block: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000']
};

export const getColorFromValue = (value, kpi) => {
    if (value === null || value === undefined) return [200, 200, 200];
    const colorHex = KPI_COLORS[kpi];
    if (!colorHex) return [200, 200, 200];
    let index = 3; // default kırmızı

    switch (kpi) {
        case 'rsrp':
            if (value >= -75) index = 0; // Yeşil
            else if (value >= -100) index = 1; // Sarı
            else if (value >= -120) index = 2; // Turuncu
            break;
        case 'rsrq':
            if (value >= -8) index = 0;
            else if (value >= -14) index = 1;
            else if (value >= -18) index = 2;
            break;
        case 'avg_dl_throughput':
            if (value >= 50000) index = 0;
            else if (value >= 10000) index = 1;
            else if (value >= 5000) index = 2;
            break;
        case 'block':
            if (value === 0) index = 0;
            else if (value <= 2) index = 1;
            else if (value <= 4) index = 2;
            break;
        default:
            index = 3;
    }
    const hex = colorHex[index] || '#cccccc';
    const rgb = hex.match(/[\da-f]{2}/gi)?.map((h) => parseInt(h, 16)) || [200, 200, 200];
    return rgb;
};

function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export function getGridColorFromValue(kpi, value) {
    // console.log("kpi", kpi);
    // console.log("value", value);

    if (value === null || value === undefined) {
        return hexToRgb('#212529'); // default for null/0
    }

    switch (kpi) {
        case 'rsrp':
            if (value >= -70) return hexToRgb('#008000');
            if (value >= -80) return hexToRgb('#71B800');
            if (value >= -90) return hexToRgb('#AAD500');
            if (value >= -95) return hexToRgb('#DFE300');
            if (value >= -100) return hexToRgb('#FFAA00');
            if (value >= -110) return hexToRgb('#FF7300');
            if (value >= -120) return hexToRgb('#E13900');
            if (value >= -140) return hexToRgb('#E30000');
            return hexToRgb('#212529');

        case 'rsrq':
            if (value >= -6) return hexToRgb('#008000');
            if (value >= -10) return hexToRgb('#71B800');
            if (value >= -12) return hexToRgb('#DFE300');
            if (value >= -18) return hexToRgb('#FFAA00');
            if (value >= -25) return hexToRgb('#E30000');
            return hexToRgb('#212529');

        case 'rssinr':
            if (value <= -5) return hexToRgb('#a50026');
            if (value <= 0) return hexToRgb('#ea593a');
            if (value <= 5) return hexToRgb('#fdbf6f');
            if (value <= 7) return hexToRgb('#ffec00');
            if (value <= 10) return hexToRgb('#b7e075');
            if (value <= 15) return hexToRgb('#4db15d');
            return hexToRgb('#006837');

        case 'block':
            if (value === 0) return hexToRgb('#008000');
            if (value < 3) return hexToRgb('#DFE300');
            if (value < 5) return hexToRgb('#FF7300');
            return hexToRgb('#E30000');

        case 'dl_throughput':
        case 'ul_throughput_mb':
            if (value > 10000) return hexToRgb('#008000');
            if (value > 5000) return hexToRgb('#71B800');
            if (value > 3000) return hexToRgb('#DFE300');
            if (value > 1000) return hexToRgb('#FFAA00');
            if (value >= 0) return hexToRgb('#E30000');
            return hexToRgb('#212529');

        default:
            return hexToRgb('#999999'); // fallback
    }
}

export function createSectorPolygon(center, radiusInMeters, azimuth, beamwidth, steps = 30) {
    const [lon, lat] = center;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const coords = [[lon, lat]];

    const latRad = toRad(lat);
    const degLatPerMeter = 1 / 110574;
    const degLonPerMeter = 1 / (111320 * Math.cos(latRad));

    const startAngle = azimuth - beamwidth / 2;
    const endAngle = azimuth + beamwidth / 2;

    for (let i = 0; i <= steps; i++) {
        const angle = toRad(startAngle + (i * (endAngle - startAngle)) / steps);
        const dx = Math.cos(angle) * radiusInMeters;
        const dy = Math.sin(angle) * radiusInMeters;
        const point = [lon + dx * degLonPerMeter, lat + dy * degLatPerMeter];
        coords.push(point);
    }

    coords.push([lon, lat]);
    return coords;
}
