import * as React from 'react';
import styles from './ReactReduxTraining.module.scss';
import { IReactReduxTrainingProps } from './IReactReduxTrainingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import BooksGrid from './BooksGrid';
import AddBook from './AddBook';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { mainReducer, defaultState } from '../store/reduces';
import thunk from 'redux-thunk';
const store = createStore(mainReducer, defaultState(), applyMiddleware(thunk));

export default class ReactReduxTraining extends React.Component<IReactReduxTrainingProps, {}> {
  public render(): React.ReactElement<IReactReduxTrainingProps> {
    return (
      <div>
     <Provider store={store}>
          <BooksGrid/>
          <AddBook/>
      </Provider>
      </div>
    );
  }
}
