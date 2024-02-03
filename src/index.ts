import * as geo from "./geo/geo";
import { LatLong } from "./geo/geo";

// const centerPoint: LatLong = { latitude: 47.617707, longitude: -122.305087 };
// const startingRadius = geo.milesToMeters(1);
// const radiusGap = geo.milesToMeters(1);
// const finalRadius = geo.milesToMeters(10);
// const pointsAlongRadiusStart = 16;
// const pointsAlongRadiusGrowth = 1.1;

// const evaluationPointsPerRadius = geo.getEvaluationPointsGeometricBased(centerPoint, startingRadius, radiusGap, finalRadius, pointsAlongRadiusStart, pointsAlongRadiusGrowth);
// evaluationPointsPerRadius.forEach((evaluationPointsForRadius) => {
//     // console.log(geo.metersToMiles(evaluationPointsForRadius.radius), evaluationPointsForRadius.points.length);
//     // evaluationPointsForRadius.points.forEach((evaluationPoint) => console.log(evaluationPoint));
//     evaluationPointsForRadius.points.forEach((evaluationPoint) => console.log(`${evaluationPoint.latitude},${evaluationPoint.longitude},red,square,`));
// });

const centerPoint: LatLong = { latitude: 47.617707, longitude: -122.305087 };
const startingRadius = 1000;
const radiusGap = 1000;
const finalRadius = 10000;
const distanceBetweenPoints = 1000;

const evaluationPointsPerRadius = geo.getEvaluationPointsSpacingBased(centerPoint, startingRadius, radiusGap, finalRadius, distanceBetweenPoints);
evaluationPointsPerRadius.forEach((evaluationPointsForRadius) => {
    // console.log(geo.metersToMiles(evaluationPointsForRadius.radius), evaluationPointsForRadius.points.length);
    // evaluationPointsForRadius.points.forEach((evaluationPoint) => console.log(evaluationPoint));
    evaluationPointsForRadius.points.forEach((evaluationPoint) => console.log(`${evaluationPoint.latitude},${evaluationPoint.longitude},red,square,`));
});
