import { Action, Dispatch } from 'redux';
import Mission from '../models/Mission';
import MissionServices from '../services/MissionServices';

export const ACTION_MISSION_FETCH ='MISSION_FETCH';
export const ACTION_MISSION_FETCH_SUCCESS ='MISSION_FETCH_SUCCESS';
export const ACTION_MISSION_FETCH_ERROR ='MISSION_FETCH_ERROR';

export const ACTION_MISSION_ADD ='MISSION_ADD';
export const ACTION_MISSION_ADD_SUCCESS ='MISSION_ADD_SUCCESS';
export const ACTION_MISSION_ADD_ERROR ='MISSION_ADD_ERROR';

export const ACTION_MISSION_DELETE ='MISSION_DELETE';
export const ACTION_MISSION_DELETE_SUCCESS ='MISSION_DELETE_SUCCESS';
export const ACTION_MISSION_DELETE_ERROR ='MISSION_DELETE_ERROR';

export const ACTION_MISSION_UPDATE ='MISSION_UPDATE';
export const ACTION_MISSION_UPDATE_SUCCESS ='MISSION_UPDATE_SUCCESS';
export const ACTION_MISSION_UPDATE_ERROR ='MISSION_UPDATE_ERROR';

export const ACTION_OPEN_PANEL ='OPEN_PANEL';
export const ACTION_CLOSE_PANEL ='CLOSE_PANEL';





export interface IActionMissionFetch extends Action {
  type: string;
}
export interface IActionMissionFetchSuccess extends Action {
  type: string;
  missions: Mission[];
}
export interface IActionMissionFetchError extends Action {
  type: string;
  errorMessage: string;
}
export interface IActionOpenPanel extends Action {
  type: string;
}
export interface IActionClosePanel extends Action {
  type: string;
}
export interface IActionMissionAdd extends Action {
  type: string;
}
export interface IActionMissionAddSuccess extends Action {
  type: string;
  missions: Mission[];
}
export interface IActionMissionAddError extends Action {
  type: string;
  errorMessage: string;
}

export interface IActionMissionDelete extends Action {
  type: string;
}
export interface IActionMissionDeleteSuccess extends Action {
  type: string;
  notes: Mission[];
}
export interface IActionMissionDeleteError extends Action {
  type: string;
  errorMessage: string;
}


export interface IActionMissionUpdate extends Action {
  type: string;
}
export interface IActionMissionUpdateSuccess extends Action {
  type: string;
  notes: Mission[];
}
export interface IActionMissionUpdateError extends Action {
  type: string;
  errorMessage: string;
}


function dispatchFetchMissionProgress(): IActionMissionFetch {
  return {
    type: ACTION_MISSION_FETCH
  };
}

function dispatchFetchMessionsSuccess(missions: Mission[]): IActionMissionFetchSuccess {
  return {
    type: ACTION_MISSION_FETCH_SUCCESS,
    missions: missions
  };
}

function dispatchFetchMissionsError(e: Error): IActionMissionFetchError {
  return {
    type: ACTION_MISSION_FETCH_ERROR,
    errorMessage: e.message
  };
}

function dispatchAddMissionProgress(): IActionMissionAdd {
  return {
    type: ACTION_MISSION_ADD
  };
}
function dispatchAddMissionSucess(missions: Mission[]): IActionMissionAddSuccess {
  return {
    type: ACTION_MISSION_ADD_SUCCESS,
    missions:missions
  };
}

function dispatchAddMissionError(error): IActionMissionAddError {
  return {
    type: ACTION_MISSION_ADD_ERROR,
    errorMessage:error
  };
}

function dispatchOpenPanel(): IActionOpenPanel {
  return {
    type: ACTION_OPEN_PANEL
  };
}

function dispatchClosePanel(): IActionClosePanel {
  return {
    type: ACTION_CLOSE_PANEL
  };
}


export function actionFetchMissions() {
  return (dispatch: Dispatch) => {
    dispatch(dispatchFetchMissionProgress());
    return MissionServices.getAllMission()
    .then((missions) => {
      return dispatch(dispatchFetchMessionsSuccess(missions));
    })
    .catch((e: Error) => {
      return dispatch(dispatchFetchMissionsError(e));
    });
  };
}

export function actionAddMission(newMission:Mission) {
  return (dispatch: Dispatch) => {
    dispatch(dispatchAddMissionProgress());
    return MissionServices.AddMission(newMission)
    .then((res) => {
      return dispatch(dispatchAddMissionSucess(res));
    })
    .catch((e: Error) => {
      return dispatch(dispatchFetchMissionsError(e));
    });
  };
}
export function actionOpenPanel(dispatch: Dispatch) {
     return dispatch(dispatchOpenPanel());

}
export function actionClosePanel(dispatch: Dispatch) {
 return dispatch(dispatchClosePanel());
}

export type AppsAction=IActionClosePanel|IActionOpenPanel|IActionMissionFetch|IActionMissionFetchError|IActionMissionFetchSuccess|IActionMissionAdd|IActionMissionAddError|IActionMissionAddSuccess|IActionMissionDelete|IActionMissionDeleteError|IActionMissionDeleteSuccess|IActionMissionUpdate|IActionMissionUpdate|IActionMissionUpdateError|IActionMissionUpdateSuccess;
