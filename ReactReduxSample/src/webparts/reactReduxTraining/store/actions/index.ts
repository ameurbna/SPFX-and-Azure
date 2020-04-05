import { Action, Dispatch } from 'redux';
import IBook from '../models/IBook';
import BookServices from '../services/BookServices';

export const ACTION_BOOK_FETCH ='BOOK_FETCH';
export const ACTION_BOOK_FETCH_SUCCESS ='BOOK_FETCH_SUCCESS';
export const ACTION_BOOK_FETCH_ERROR ='BOOK_FETCH_ERROR';

export const ACTION_BOOK_ADD ='BOOK_ADD';
export const ACTION_BOOK_ADD_SUCCESS ='BOOK_ADD_SUCCESS';
export const ACTION_BOOK_ADD_ERROR ='BOOK_ADD_ERROR';


export const ACTION_OPEN_PANEL ='OPEN_PANEL';
export const ACTION_CLOSE_PANEL ='CLOSE_PANEL';





export interface IActionBookFetch extends Action {
  type: string;
}
export interface IActionBookFetchSuccess extends Action {
  type: string;
  IBooks: IBook[];
}
export interface IActionBookFetchError extends Action {
  type: string;
  errorMessage: string;
}
export interface IActionOpenPanel extends Action {
  type: string;
}
export interface IActionClosePanel extends Action {
  type: string;
}
export interface IActionBookAdd extends Action {
  type: string;
}
export interface IActionBookAddSuccess extends Action {
  type: string;
  IBooks: IBook[];
}
export interface IActionBookAddError extends Action {
  type: string;
  errorMessage: string;
}





function dispatchFetchBookProgress(): IActionBookFetch {
  return {
    type: ACTION_BOOK_FETCH
  };
}

function dispatchFetchBooksSuccess(IBooks: IBook[]): IActionBookFetchSuccess {
  return {
    type: ACTION_BOOK_FETCH_SUCCESS,
    IBooks: IBooks
  };
}

function dispatchFetchBooksError(e: Error): IActionBookFetchError {
  return {
    type: ACTION_BOOK_FETCH_ERROR,
    errorMessage: e.message
  };
}

function dispatchAddBookProgress(): IActionBookAdd {
  return {
    type: ACTION_BOOK_ADD
  };
}
function dispatchAddBookSucess(IBooks: IBook[]): IActionBookAddSuccess {
  return {
    type: ACTION_BOOK_ADD_SUCCESS,
    IBooks:IBooks
  };
}

function dispatchAddIBookError(error): IActionBookAddError {
  return {
    type: ACTION_BOOK_ADD_ERROR,
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


export function actionFetchBooks() {
  return (dispatch: Dispatch) => {
    dispatch(dispatchFetchBookProgress());
    return BookServices.getAllBooks()
    .then((IBooks) => {
      return dispatch(dispatchFetchBooksSuccess(IBooks));
    })
    .catch((e: Error) => {
      return dispatch(dispatchFetchBooksError(e));
    });
  };
}

export function actionAddBook(newIBook:IBook) {
  return (dispatch: Dispatch) => {
    dispatch(dispatchAddBookProgress());
    return BookServices.AddBook(newIBook)
    .then((res) => {
      return dispatch(dispatchAddBookSucess(res));
    })
    .catch((e: Error) => {
      return dispatch(dispatchFetchBooksError(e));
    });
  };
}
export function actionOpenPanel(dispatch: Dispatch) {
     return dispatch(dispatchOpenPanel());

}
export function actionClosePanel(dispatch: Dispatch) {
 return dispatch(dispatchClosePanel());
}

export type AppsAction=IActionClosePanel|IActionOpenPanel|IActionBookFetch|IActionBookFetchError|IActionBookFetchSuccess|IActionBookAdd|IActionBookAddError|IActionBookAddSuccess;
