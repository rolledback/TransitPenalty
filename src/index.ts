import * as geo from "./geo/geo";
import { LatLong } from "./geo/geo";

const getEvaluationPointsButton: HTMLButtonElement = document.getElementById("calculate-button") as HTMLButtonElement;
getEvaluationPointsButton.onclick = () => {
    const centerPoint: LatLong = {
        latitude: Number.parseFloat((document.getElementById("center-point-latitude-input") as HTMLInputElement).value),
        longitude: Number.parseFloat((document.getElementById("center-point-longitude-input") as HTMLInputElement).value)
    };
    const options: geo.GetEvaluationPointsOptions = {
        type: "circular",
        startingRadius: Number.parseFloat((document.getElementById("starting-radius-input") as HTMLInputElement).value),
        radiusGap: Number.parseFloat((document.getElementById("radius-gap-input") as HTMLInputElement).value),
        finalRadius: Number.parseFloat((document.getElementById("final-radius-input") as HTMLInputElement).value),
        idealDistanceBetweenPoints: Number.parseFloat((document.getElementById("ideal-distance-input") as HTMLInputElement).value)
    };
    const evaluationPointsPerRadius = geo.getEvaluationPoints(centerPoint, options);

    const outputString = evaluationPointsPerRadius.map((evaluationPointsForRadius) => evaluationPointsForRadius.points
        .map((evaluationPoint) => `${evaluationPoint.latitude},${evaluationPoint.longitude},red,square,`)
        .join("\n")
    ).join("\n");

    const outputTextArea = document.getElementById("output-text-area") as HTMLTextAreaElement;
    outputTextArea.value = outputString;
};
