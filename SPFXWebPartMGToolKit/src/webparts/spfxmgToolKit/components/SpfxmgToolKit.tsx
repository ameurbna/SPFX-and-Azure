import * as React from 'react';
import styles from './SpfxmgToolKit.module.scss';
import { ISpfxmgToolKitProps } from './ISpfxmgToolKitProps';
import { escape } from '@microsoft/sp-lodash-subset';
import '@microsoft/mgt';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mgt-person': any;
      'mgt-agenda': any;
      'mgt-msal-provider': any;
      'mgt-tasks': any;
      template: any;
    }
  }
}
export default class SpfxmgToolKit extends React.Component<ISpfxmgToolKitProps, {}> {
  public render(): React.ReactElement<ISpfxmgToolKitProps> {
    return (
      <div className={ styles.spfxmgToolKit }>
        <div className={ styles.container }>
        <mgt-msal-provider client-id="44158e0f-9547-44de-a0fa-8abec453a898"></mgt-msal-provider>
        <hr/>
          <mgt-person person-query="me" show-name person-card="hover" />
        <hr/>
          <mgt-agenda></mgt-agenda>
          <hr/>
          <mgt-tasks data-source="todo"></mgt-tasks>
        </div>
      </div>
    );
  }
}
