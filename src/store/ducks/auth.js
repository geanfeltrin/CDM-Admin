import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* Types & Action Creators */

const { Types, Creators } = createActions({
  signInRequest: ["email", "password"],
  signInSuccess: ["token", "user"],
  signOut: null,
  getPermissionRequest: null,
  getPermissionSuccess: ["permission"]
});

export const AuthTypes = Types;
export default Creators;

/* Initial State */

export const INITIAL_STATE = Immutable({
  permission: localStorage.getItem("@cdm-adm:permission") || null,
  signedIn: !!localStorage.getItem("@cdm-adm:token"),
  token: localStorage.getItem("@cdm-adm:token") || null,
  user: localStorage.getItem("@cdm-adm:user") || null
});

/* Reducers */

export const success = (state, { token, user }) => {
  return state.merge({ signedIn: true, token , user });
};
export const logout = state =>
  state.merge({ signOut: false, token: null, user: null });

export const permissionSuccess = (state, { permission }) => {
  console.log(permission);
  state.merge({ permission });
};

/* Reducers to types */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGN_IN_SUCCESS]: success,
  [Types.SIGN_OUT]: logout,
  [Types.GET_PERMISSION_SUCCESS]: permissionSuccess
});
