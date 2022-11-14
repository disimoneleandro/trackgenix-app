import {
  GET_ADMINS_PENDING,
  GET_ADMINS_SUCCESS,
  GET_ADMINS_ERROR,
  DELETE_ADMINS_PENDING,
  DELETE_ADMINS_SUCCESS,
  DELETE_ADMINS_ERROR
} from './constants';

const INITIAL_STATE = {
  list: [],
  fetching: false,
  error: '',
  children: ''
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ADMINS_PENDING:
      return {
        ...state,
        fetching: true
      };
    case GET_ADMINS_SUCCESS:
      return {
        ...state,
        fetching: false,
        error: '',
        list: action.payload
      };
    case GET_ADMINS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
        list: []
      };
    case DELETE_ADMINS_PENDING:
      return {
        ...state,
        fetching: true
      };
    case DELETE_ADMINS_SUCCESS:
      return {
        ...state,
        fetching: false,
        list: [...state.list.filter((admin) => admin._id !== action.payload)],
        children: 'Admin deleted successfully'
      };
    case DELETE_ADMINS_ERROR:
      return {
        ...state,
        fetching: false,
        children: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
