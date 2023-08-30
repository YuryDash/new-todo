import { appActions, appInitialStateType, appReducer } from "./app-reducer";

let startState: appInitialStateType;
beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
  };
});

test("correct error message should be set", () => {
  const endState = appReducer(startState, appActions.setAppError({ error: "Test error message" }));
  expect(endState.error).toBe("Test error message");
});

test("correct status should be change", () => {
  const endState = appReducer(startState, appActions.setAppStatus({ status: "succeeded" }));
  expect(endState.status).toBe("succeeded");
});