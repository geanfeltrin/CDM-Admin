import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* Types & Action Creators */

const { Types, Creators } = createActions({
  getPostRequest: ["page"],
  getPostSuccess: ["data"],
  openPostModal: null,
  closePostModal: null,
  createPostRequest: [
    "title",
    "description",
    "url",
    "sub_category_id",
    "type_post",
    "featured",
    "download_id",
    "thumbnail_id"
  ],
  createPostSuccess: ["post"],
  updateFeaturedRequest: ["id", "featured"],
  updateFeaturedSuccess: ["update"]
});

export const PostTypes = Types;
export default Creators;

/* Initial State */

export const INITIAL_STATE = Immutable({
  data: [],
  PostModalOpen: false
});

/* Reducers */

export const success = (state, { data }) => state.merge({ data });

export const openModal = state => state.merge({ PostModalOpen: true });

export const closeModal = state => state.merge({ PostModalOpen: false });

export const createSuccess = (state, { post }) =>
  state.merge({ data: { ...state.data, data: [post, ...state.data.data] } });

export const featuredSuccess = (state, { update }) =>
  state.merge({ data: [...state.data, update] });
/* Reducers to types */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_POST_SUCCESS]: success,
  [Types.CREATE_POST_SUCCESS]: createSuccess,
  [Types.OPEN_POST_MODAL]: openModal,
  [Types.CLOSE_POST_MODAL]: closeModal,
  [Types.UPDATE_FEATURED_SUCCESS]: featuredSuccess
});
