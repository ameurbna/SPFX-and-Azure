import { IPanelSendProps } from './../components/PanelSendEmail';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import PanelSendEmail from '../components/PanelSendEmail';
import * as strings from 'ExtensionSpfxCmdSetSendEmailCommandSetStrings';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IExtensionSpfxCmdSetSendEmailCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
  panelSendEmail: React.ReactElement<{}>;

}

const LOG_SOURCE: string = 'ExtensionSpfxCmdSetSendEmailCommandSet';

export default class ExtensionSpfxCmdSetSendEmailCommandSet extends BaseListViewCommandSet<IExtensionSpfxCmdSetSendEmailCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized ExtensionSpfxCmdSetSendEmailCommandSet');
    var element = document.createElement("div");
    element.setAttribute("id", "PanelEmail");
    document.body.appendChild(element);
    this.properties.panelSendEmail=React.createElement(PanelSendEmail, {} );
    ReactDOM.render(this.properties.panelSendEmail,document.getElementById("PanelEmail"));
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    // if (compareOneCommand) {
    //   // This command should be hidden unless exactly one row is selected.
    //   compareOneCommand.visible = event.selectedRows.length === 1;
    // }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        let selectedItemHtml:string="<table>";

        let i:number=0;
        event.selectedRows.forEach(element => {
          if(i==0){
            selectedItemHtml+="<tr>";
            element.fields.forEach(e => {
              selectedItemHtml+="<th>"+e.displayName+"</th>";
            });
            selectedItemHtml+="</tr>";
          }
            selectedItemHtml+="<tr>";
            element.fields.forEach(e => {
              selectedItemHtml+="<td>"+element.getValueByName(e.internalName)+"</td>";
            });
            selectedItemHtml+="</tr>";

          i++;
        });
        selectedItemHtml+="</table>";
        (this.properties.panelSendEmail.props as IPanelSendProps).mailBody=selectedItemHtml;
        (this.properties.panelSendEmail.props as IPanelSendProps).showPanel();
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
