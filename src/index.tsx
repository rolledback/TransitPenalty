import * as geo from "./geo/geo";
import { LatLong } from "./geo/geo";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

const defaultState: TransitPenaltyStartState = {
    phase: "start",
    centerPoint: { latitude: 47.617707, longitude: -122.305087 },
    getEvaluationPointsOptions: {
        type: "circular",
        startingRadius: 1000,
        radiusGap: 1000,
        finalRadius: 10000,
        idealDistanceBetweenPoints: 1000,
    }
};

type TransitPenaltyStartState = { phase: "start"; centerPoint: LatLong; getEvaluationPointsOptions: geo.GetEvaluationPointsOptions; }
type TransitPenaltyGetEvaluationPointsState = Omit<TransitPenaltyStartState, "phase"> & { phase: "evaluationCalculated"; evaluationPointsPerRadius: { radius: number; points: geo.LatLong[]; }[]; };
type TransitPenaltyGetNavigablePointsState = Omit<TransitPenaltyGetEvaluationPointsState, "phase"> & { phase: "navigableCalculated"; navigablePoints: geo.LatLong[]; };
type TransitPenaltyState = TransitPenaltyStartState | TransitPenaltyGetEvaluationPointsState | TransitPenaltyGetNavigablePointsState;

type TransitPenaltyAction =
    { action: "startParameterChanged"; newStartParameters: Omit<TransitPenaltyStartState, "phase"> } |
    { action: "calculateEvaluation"; centerPoint: LatLong; getEvaluationPointsOptions: geo.GetEvaluationPointsOptions; } |
    { action: "calculateNavigable" };

function getTransitPenaltyStateReducer(): React.Reducer<TransitPenaltyState, TransitPenaltyAction> {
    return (state: TransitPenaltyState, action: TransitPenaltyAction) => {
        function changeStartParameters(state: TransitPenaltyState, newStartParameters: Omit<TransitPenaltyStartState, "phase">) {
            return { ...state, ...newStartParameters };
        }

        function calculateEvaluation(state: TransitPenaltyState, centerPoint: LatLong, options: geo.GetEvaluationPointsOptions): TransitPenaltyState {
            return { ...state, phase: "evaluationCalculated", evaluationPointsPerRadius: geo.getEvaluationPoints(centerPoint, options) };
        }

        function calculateNavigable(state: TransitPenaltyState) {
            return state;
        }

        if (action.action === "startParameterChanged") {
            return changeStartParameters(state, action.newStartParameters);
        } if (action.action === "calculateEvaluation") {
            return calculateEvaluation(state, action.centerPoint, action.getEvaluationPointsOptions);
        } else {
            return calculateNavigable(state);
        }
    };
}

function TransitPenalty(): JSX.Element {
    const reduceTransitPenaltyState = getTransitPenaltyStateReducer();
    const [state, dispatch] = React.useReducer(reduceTransitPenaltyState, defaultState);

    function onStartParameterChanged(newStartParameters: Omit<TransitPenaltyStartState, "phase">) {
        dispatch({ action: "startParameterChanged", newStartParameters: newStartParameters });
    }

    function onCalculateClicked() {
        dispatch({ action: "calculateEvaluation", centerPoint: state.centerPoint, getEvaluationPointsOptions: state.getEvaluationPointsOptions });
    }

    return (
        <div>
            <div>
                <label htmlFor={"center-point-latitude-input"}>Center Point Latitude:</label>
                <br></br>
                <input id={"center-point-latitude-input"}
                    type={"number"}
                    value={state.centerPoint.latitude}
                    onChange={(event) => onStartParameterChanged({ getEvaluationPointsOptions: state.getEvaluationPointsOptions, centerPoint: { ...state.centerPoint, latitude: Number.parseFloat(event.target.value) } })}>
                </input>
                <br></br>
                <label htmlFor={"center-point-longitude-input"}>Center Point Longitude:</label>
                <br></br>
                <input
                    id={"center-point-longitude-input"}
                    type={"number"}
                    value={state.centerPoint.longitude}
                    onChange={(event) => onStartParameterChanged({ getEvaluationPointsOptions: state.getEvaluationPointsOptions, centerPoint: { ...state.centerPoint, longitude: Number.parseFloat(event.target.value) } })}>
                </input>
                <br></br>
                <label htmlFor={"starting-radius-input"}>Starting Radius:</label>
                <br></br>
                <input
                    id={"starting-radius-input"}
                    type={"number"}
                    value={state.getEvaluationPointsOptions.startingRadius}
                    onChange={(event) => onStartParameterChanged({ getEvaluationPointsOptions: { ...state.getEvaluationPointsOptions, startingRadius: Number.parseFloat(event.target.value) }, centerPoint: state.centerPoint })}>
                </input>
                <br></br>
                <label htmlFor={"radius-gap-input"}>Radius Gap:</label>
                <br></br>
                <input
                    id={"radius-gap-input"}
                    type={"number"}
                    value={state.getEvaluationPointsOptions.radiusGap}
                    onChange={(event) => onStartParameterChanged({ getEvaluationPointsOptions: { ...state.getEvaluationPointsOptions, radiusGap: Number.parseFloat(event.target.value) }, centerPoint: state.centerPoint })}>
                </input>
                <br></br>
                <label htmlFor={"final-radius-input"}>Final Radius:</label>
                <br></br>
                <input
                    id={"final-radius-input"}
                    type={"number"}
                    value={state.getEvaluationPointsOptions.finalRadius}
                    onChange={(event) => onStartParameterChanged({ getEvaluationPointsOptions: { ...state.getEvaluationPointsOptions, finalRadius: Number.parseFloat(event.target.value) }, centerPoint: state.centerPoint })}>
                </input>
                <br></br>
                <label htmlFor={"ideal-distance-input"}>Ideal Distance Between Points:</label>
                <br></br>
                <input
                    id={"ideal-distance-input"}
                    type={"number"}
                    value={state.getEvaluationPointsOptions.idealDistanceBetweenPoints}
                    onChange={(event) => onStartParameterChanged({ getEvaluationPointsOptions: { ...state.getEvaluationPointsOptions, idealDistanceBetweenPoints: Number.parseFloat(event.target.value) }, centerPoint: state.centerPoint })}>
                </input>
                <br></br>
            </div>

            <div>
                <button
                    id={"calculate-button"}
                    onClick={onCalculateClicked}>Get Evaluation Points
                </button>
                <br></br>
                <textarea
                    id={"output-text-area"}
                    defaultValue={state.phase === "start" ? undefined : state.evaluationPointsPerRadius.map((evaluationPointsForRadius) => evaluationPointsForRadius.points
                        .map((evaluationPoint) => `${evaluationPoint.latitude},${evaluationPoint.longitude},red,square,`)
                        .join("\n")
                    ).join("\n")}
                    readOnly={true}
                    rows={32}
                    cols={64}>
                </textarea>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<TransitPenalty></TransitPenalty>);
