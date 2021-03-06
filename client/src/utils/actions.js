// PROJECT ACTIONS
export const ADD_PROJECT = "ADD_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";

// TASK ACTIONS
export const ADD_TASK = "ADD_TASK";
export const UPDATE_TASK = "UPDATE_TASK";

// USER ACTIONS
export const UPDATE_USER = "UPDATE_USER";

//TASK STATUS
export const TASK_NEW = "New";
export const TASK_TODO = "To Do";
export const TASK_WIP = "In Progress";
export const TASK_REVIEW = "In Review";
export const TASK_DONE = "Completed";
export const STATARR = [TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE];
export const STATMAP = {
	TASK_NEW,
	TASK_TODO,
	TASK_WIP,
	TASK_REVIEW,
	TASK_DONE
};

// REACT DND ITEMS
export const ItemTypes = {
	DTASK: "task"
};
