import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'MyTasksMonitorsWebPartStrings';
import MyTasksMonitors from './components/MyTasksMonitors';
import { IMyTasksMonitorsProps } from './components/IMyTasksMonitorsProps';

export interface IMyTasksMonitorsWebPartProps {
  description: string;
  context:WebPartContext;
  siteTaskUrl:string;
}

export default class MyTasksMonitorsWebPart extends BaseClientSideWebPart <IMyTasksMonitorsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyTasksMonitorsProps> = React.createElement(
      MyTasksMonitors,
      {
        description: this.properties.description,
        context:this.context,
        siteTaskUrl:this.properties.siteTaskUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('siteTaskUrl', {
                  label: strings.SiteTaskFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
