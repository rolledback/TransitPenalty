import * as geolib from "geolib";

export type LatLong = { latitude: number, longitude: number };

export function getEvaluationPointsGeometricBased(centerPoint: LatLong, startingRadius: number, radiusGap: number, finalRadius: number, pointsAlongRadiusStart: number, pointsAlongRadiusGrowth: number): { radius: number, points: LatLong[] }[] {
    const radiuses: number[] = [startingRadius];
    while (radiuses[radiuses.length - 1] + radiusGap < finalRadius) {
        radiuses.push(radiuses[radiuses.length - 1] + radiusGap);
    }
    return radiuses.map((radius, idx) => ({ radius: radius, points: getEvaluationPointsForRadius(centerPoint, radius, (pointsAlongRadiusStart * (Math.pow(pointsAlongRadiusGrowth, idx)))) }));
}

export function getEvaluationPointsSpacingBased(centerPoint: LatLong, startingRadius: number, radiusGap: number, finalRadius: number, distanceBetweenPoints: number): { radius: number, points: LatLong[] }[] {
    const radiuses: number[] = [startingRadius];
    while (radiuses[radiuses.length - 1] + radiusGap < finalRadius) {
        radiuses.push(radiuses[radiuses.length - 1] + radiusGap);
    }
    radiuses.forEach((radius) => console.log(Math.PI * (radius * 2), distanceBetweenPoints));
    return radiuses.map((radius) => ({ radius: radius, points: getEvaluationPointsForRadius(centerPoint, radius, Math.floor((Math.PI * (radius * 2) / distanceBetweenPoints))) }));
}

function getEvaluationPointsForRadius(centerPoint: LatLong, radius: number, pointsAlongRadius: number) {
    const bearings: number[] = [];
    for (let i = 0; i < pointsAlongRadius; i++) {
        bearings[i] = i * 360 / pointsAlongRadius;
    }

    return bearings.map((bearing) => geolib.computeDestinationPoint(centerPoint, radius, bearing));
}

export function milesToMeters(miles: number): number {
    return miles * 1609.34;
}

export function metersToMiles(meters: number): number {
    return meters / 1609.34;
}