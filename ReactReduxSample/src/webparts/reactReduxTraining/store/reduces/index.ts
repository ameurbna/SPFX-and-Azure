import { IActionBookFetchSuccess, ACTION_BOOK_FETCH_ERROR, ACTION_BOOK_ADD, ACTION_BOOK_ADD_SUCCESS, ACTION_BOOK_ADD_ERROR, IActionBookAddError, ACTION_CLOSE_PANEL, IActionBookAddSuccess } from './../actions/index';
import { AppsAction, ACTION_OPEN_PANEL, ACTION_BOOK_FETCH, ACTION_BOOK_FETCH_SUCCESS } from '../actions';
import IBook from '../models/IBook';
import { Action } from 'redux';


export interface ListIBookState{
  state: string;
  Books: IBook[];
  errorMessage?: string;
  Book?:IBook;
}

export function defaultIBooksListState() {
  return {
    state: 'INIT',
    IBooks: [],
    isOpen:false,
  };
}

export function BooksListReducer(state: ListIBookState, action: AppsAction): ListIBookState {
  if (action.type === ACTION_BOOK_FETCH) {
    return {
      ...state,
      state: 'Loading',
      Books: []

    };
  }
  if (action.type === ACTION_BOOK_FETCH_SUCCESS) {
    return {
      ...state,
      state: 'Succes',
      Books: (<IActionBookFetchSuccess>action).IBooks

    };
  }
  if (action.type === ACTION_BOOK_FETCH_ERROR) {
    return {
      ...state,
      state: 'Error',
      Books: [],
    };
  }
  if (action.type === ACTION_BOOK_ADD) {
    return {
      ...state,
      state: 'Saving',
      Books: []
    };
  }
  if (action.type === ACTION_BOOK_ADD_SUCCESS) {
    return {
      ...state,
      state: 'Saved',
      Books: (<IActionBookAddSuccess>action).IBooks,

    };
  }
  if (action.type === ACTION_BOOK_ADD_ERROR) {
    return {
      ...state,
      state: 'ERROR',
      Books: [],
      errorMessage:  (<IActionBookAddError>action).errorMessage
    };
  }

  return state;
}
export function defaultBookListState() {
  return {
    state: "INIT",
  Books: [],
  };
}
export interface AppState {
    list: ListIBookState;
}

export function defaultState() {
  return {
    list: defaultBookListState()
  };
}

export function mainReducer(state: AppState = defaultState(), action: Action) {
  return {
    list: BooksListReducer(state.list, action)
  };
}
