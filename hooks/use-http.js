import { useCallback, useReducer } from "react";
const initialState = { isLoading: true, error: false, data: false };

const actions = {};

const reducer = (state, action) => {
  if (action.type === "SET_LOADING")
    return { ...state, isLoading: action.payload };
  if (action.type === "SET_RESPONSE_DATA")
    return { ...state, data: action.payload };
  if (action.type === "SET_ERROR") return { ...state, error: action.payload };

  return state;
};

const useHttp = (url) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data, isLoading, error } = state;

  const sendRequest = useCallback( async () => {
    console.log("useHttp: sendRequest:: ", url);
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Something went wrong!");
      const data = await response.json();
      dispatch({ type: "SET_RESPONSE_DATA", payload: data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error });
    }
    setTimeout(() => {
      dispatch({ type: "SET_LOADING", payload: false });
    }, 500);
  }, [dispatch, url]);

  return { sendRequest, data, isLoading, error };
};

export default useHttp;
