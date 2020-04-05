import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactReduxAdvancedWebPartStrings';
import ReactReduxAdvanced from './components/ReactReduxAdvanced';
import { IReactReduxAdvancedProps } from './components/IReactReduxAdvancedProps';

export interface IReactReduxAdvancedWebPartProps {
  description: string;
}

export default class ReactReduxAdvancedWebPart extends BaseClientSideWebPart <IReactReduxAdvancedWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IReactReduxAdvancedProps> = React.createElement(
      ReactReduxAdvanced,
      {
        description: this.properties.description
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
