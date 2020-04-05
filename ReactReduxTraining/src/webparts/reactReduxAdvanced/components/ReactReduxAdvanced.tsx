import * as React from 'react';
import styles from './ReactReduxAdvanced.module.scss';
import { IReactReduxAdvancedProps } from './IReactReduxAdvancedProps';
import { escape } from '@microsoft/sp-lodash-subset';
import AddMission from '../stores/Components/AddMission';
import DetailsListMissions from '../stores/Components/DetailsListMissions';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { mainReducer, defaultState } from '../stores/reduces';
import thunk from 'redux-thunk';
const store = createStore(mainReducer, defaultState(), applyMiddleware(thunk));

export default class ReactReduxAdvanced extends React.Component<IReactReduxAdvancedProps, {}> {
  public render(): React.ReactElement<IReactReduxAdvancedProps> {
    return (
      <div className={ styles.reactReduxAdvanced }>
           <Provider store={store}>
            <DetailsListMissions />
            <AddMission />
        </Provider>
      </div>
    );
  }
}
