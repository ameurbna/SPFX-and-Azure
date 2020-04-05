import * as React from 'react';
//import styles from './ReactReduxTraining.module.scss';
import { IReactReduxTrainingProps } from './IReactReduxTrainingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import HomeView from './HomeView';
import SearchComponent from './Search';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { mainReducer, defaultState } from '../reducers';
import thunk from 'redux-thunk';

const store = createStore(mainReducer, defaultState(), applyMiddleware(thunk));

export default class ReactReduxTraining extends React.Component<IReactReduxTrainingProps, {}> {
  public render(): React.ReactElement<IReactReduxTrainingProps> {
    return (
      <div  >
        <div >
          <div >
            <div >
              <span>Welcome to SharePoint!</span>
              <Provider store={store}>
                <SearchComponent/>
                <HomeView/>
              </Provider>
          </div>
        </div>
      </div>
      </div>
    );
  }
}
