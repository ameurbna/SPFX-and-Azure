import { IActionMissionFetchSuccess, ACTION_MISSION_FETCH_ERROR, ACTION_MISSION_ADD, ACTION_MISSION_ADD_SUCCESS, ACTION_MISSION_ADD_ERROR, IActionMissionAddError, ACTION_CLOSE_PANEL, IActionMissionAddSuccess } from './../actions/index';
import { AppsAction, ACTION_OPEN_PANEL, ACTION_MISSION_FETCH, ACTION_MISSION_FETCH_SUCCESS } from '../actions';
import Mission from '../models/Mission';
import { Action } from 'redux';


export interface ListMissionState{
  state: string;
  missions: Mission[];
  errorMessage?: string;
  mission?:Mission;
  isOpen?:boolean;
}

export function defaultMissionsListState() {
  return {
    state: 'INIT',
    missions: [],
    isOpen:false,
  };
}

export function missionsListReducer(state: ListMissionState, action: AppsAction): ListMissionState {
  if (action.type === ACTION_OPEN_PANEL) {
    return {
      ...state,
      state: 'Open',
      isOpen:true,
      mission:{
        id:1,
        Description:"",
        Title:"",
        Location:""
      }
    };
  }
  if (action.type === ACTION_CLOSE_PANEL) {
    return {
      ...state,
      state: 'Close',
      isOpen:false
    };
  }
  if (action.type === ACTION_MISSION_FETCH) {
    return {
      ...state,
      state: 'Loading',
      missions: [],
      isOpen:false

    };
  }
  if (action.type === ACTION_MISSION_FETCH_SUCCESS) {
    return {
      ...state,
      state: 'Succes',
      missions: (<IActionMissionFetchSuccess>action).missions,
      isOpen:false

    };
  }
  if (action.type === ACTION_MISSION_FETCH_ERROR) {
    return {
      ...state,
      state: 'Error',
      missions: [],
    };
  }
  if (action.type === ACTION_MISSION_ADD) {
    return {
      ...state,
      state: 'Saving',
      missions: []
    };
  }
  if (action.type === ACTION_MISSION_ADD_SUCCESS) {
    return {
      ...state,
      state: 'Saved',
      isOpen:false,
      missions: (<IActionMissionAddSuccess>action).missions,

    };
  }
  if (action.type === ACTION_MISSION_ADD_ERROR) {
    return {
      ...state,
      state: 'ERROR',
      missions: [],
      errorMessage:  (<IActionMissionAddError>action).errorMessage
    };
  }

  return state;
}
export function defaultMissionListState() {
  return {
    state: "INIT",
  missions: [],
  };
}
export interface AppState {
    list: ListMissionState;
}

export function defaultState() {
  return {
    list: defaultMissionListState()
  };
}

export function mainReducer(state: AppState = defaultState(), action: Action) {
  return {
    list: missionsListReducer(state.list, action)
  };
}
