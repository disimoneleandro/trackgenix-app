import {
  getTasksPending,
  getTasksSuccess,
  getTasksError,
  deleteTasksPending,
  deleteTasksSuccess,
  deleteTasksError,
  postTasksPending,
  postTasksSuccess,
  postTasksError,
  putTasksPending,
  putTasksSuccess,
  putTasksError
} from './actions';

export const getTasks = () => {
  const token = sessionStorage.getItem('token');
  return async (dispatch) => {
    dispatch(getTasksPending());
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
        headers: { token }
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(getTasksSuccess(data.data));
      } else {
        dispatch(getTasksError(data.message.toString()));
      }
    } catch (error) {
      dispatch(getTasksError(error.toString()));
    }
  };
};

export const deleteTasks = (id) => {
  const token = sessionStorage.getItem('token');
  return async (dispatch) => {
    dispatch(deleteTasksPending());
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json', token }
      });
      if (response.ok) {
        dispatch(deleteTasksSuccess(id));
      } else {
        dispatch(deleteTasksError());
      }
    } catch (error) {
      dispatch(deleteTasksError(error.toString()));
    }
    dispatch(getTasks());
  };
};

export const createTasks = (task) => {
  const token = sessionStorage.getItem('token');
  return async (dispatch) => {
    dispatch(postTasksPending());
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify(task)
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(postTasksSuccess(data.data));
      } else {
        dispatch(postTasksError(data.message));
      }
    } catch (error) {
      dispatch(postTasksError('Error de catch', error.toString()));
    }
  };
};

export const editTasks = (id, task) => {
  const token = sessionStorage.getItem('token');
  return async (dispatch) => {
    dispatch(putTasksPending());
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json', token },
        body: JSON.stringify(task)
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(putTasksSuccess(data.data));
      } else {
        dispatch(putTasksError(data.message));
      }
    } catch (error) {
      dispatch(putTasksError(error.toString()));
    }
  };
};
