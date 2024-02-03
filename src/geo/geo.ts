import * as geolib from "geolib";

export type LatLong = { latitude: number, longitude: number };

export type GetEvaluationPointsOptions = {
    type: "circular";
    startingRadius: number;
    radiusGap: number;
    finalRadius: number;
    idealDistanceBetweenPoints: number;
}

export function getEvaluationPoints(centerPoint: LatLong, options: GetEvaluationPointsOptions): { radius: number, points: LatLong[] }[] {
    if (options.type === "circular") {
        const radiuses: number[] = [options.startingRadius];
        while (radiuses[radiuses.length - 1] + options.radiusGap < options.finalRadius) {
            radiuses.push(radiuses[radiuses.length - 1] + options.radiusGap);
        }
        radiuses.forEach((radius) => console.log(Math.PI * (radius * 2), options.idealDistanceBetweenPoints));
        return radiuses.map((radius) => ({ radius: radius, points: getEvaluationPointsForRadius(centerPoint, radius, Math.floor((Math.PI * (radius * 2) / options.idealDistanceBetweenPoints))) }));
    } else {
        throw new Error("Unsupported GetEvaluationPointsOptions type")
    }
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