import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from '@microsoft/sp-http';
import * as React from 'react';
import styles from './MyTasksMonitors.module.scss';
import { IMyTasksMonitorsProps } from './IMyTasksMonitorsProps';
import { IconButton, IIconProps, initializeIcons, ProgressIndicator } from 'office-ui-fabric-react';
import { TooltipHost, ITooltipHostStyles } from 'office-ui-fabric-react/lib/Tooltip';

import {
  DetailsList,
  IColumn,
  IGroup,
  IDetailsGroupRenderProps,
  IGroupDividerProps,
  DetailsRowCheck,
} from 'office-ui-fabric-react';
interface ITaskItem{
  ID:number,
  Title:string,
  progress:number,
  assignedTo:string,
  parentTaskId:number
}
interface MyTasksMonitorState{
  items:ITaskItem[],
  groups:IGroup[]
}
const TriangleSolidRight: IIconProps = { iconName: 'TriangleSolidRight12' };
const TriangleSolidDown: IIconProps = { iconName: 'TriangleSolidDown12' };
const calloutProps = { gapSpace: 0 };
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

export default class MyTasksMonitors extends React.Component<IMyTasksMonitorsProps, MyTasksMonitorState> {
  private _columns:IColumn[];
  private _allItems:ITaskItem[];
  constructor(props: IMyTasksMonitorsProps){
    super(props);
    this._allItems=[];
    this._columns = [
      { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 200, maxWidth: 300, isResizable: true },
      { key: 'progress', name: 'Progress', fieldName: 'progress', minWidth: 100, maxWidth: 200, onRender: this.renderPercent },
      { key: 'assignedTo', name: 'Assigned To', fieldName: 'assignedTo', minWidth: 100, maxWidth: 200 },
    ];

    this.state = {
      items: [],
      // This is based on the definition of items
      groups: [],
    };
  }
  private renderPercent (item?: any, index?: number, column?: IColumn) {
    return(
      <span>{item.progress} %</span>
    );
  }
  componentDidMount(){
    this.loadData(this.props.context,this.props.siteTaskUrl).then(
      (value:ITaskItem[])=>{
        this._allItems=value;
        const groups:IGroup[]=[];
        this._allItems.forEach((value:ITaskItem,index:number,array:ITaskItem[])=>{
          if(value.parentTaskId==-1){
            const newGroup:IGroup={
              key:value.ID.toString(),
              count:0,
              name:value.Title,
              startIndex:index,
              level:0,
              isCollapsed:true
            };
            this._allItems.forEach((valueItem:ITaskItem,indexItem:number,arrayItem:ITaskItem[])=>{
              if(valueItem.parentTaskId==value.ID){
                if(newGroup.count==0)
                  newGroup.startIndex=indexItem;
                newGroup.count++;
              }
            }); 
            if(newGroup.count==0)newGroup.count=1;  
            groups.push(newGroup);  
          }
        });
      

        this.setState({
          items:this._allItems,
          groups:groups
        });
      },
    (error:any)=>{

    })
  }
  public render(): React.ReactElement<IMyTasksMonitorsProps> {
    const {items,groups}=this.state;
    console.log(items);
    console.log(groups);
    const isTeamsEnv=this.props.context.sdks.microsoftTeams;
    //this.loadData(this.props.context,this.props.siteTaskUrl);
    return (
     <div>
         <DetailsList
          items={items}
          groups={groups}
          groupProps={{
            showEmptyGroups: true,
            isAllGroupsCollapsed:true,
            onRenderHeader: this._onRenderGroupHeader,
            onRenderFooter: this._onRenderGroupFooter,
          }}
          columns={this._columns}
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          ariaLabelForSelectionColumn="Toggle selection"
          checkButtonAriaLabel="Row checkbox"
          onRenderItemColumn={this._onRenderColumn}
        />
     </div>
    );
  }
  private _onRenderColumn(item: ITaskItem, index: number, column: IColumn) {
    const value =
      item && column && column.fieldName ? item[column.fieldName as keyof ITaskItem] || '' : '';

    return <div data-is-focusable={true}>{value}</div>;
  }
  private _onRenderGroupHeader: IDetailsGroupRenderProps['onRenderHeader'] = props => {
    if (props) {
      const progress:number=this.getGroupProgressPercent(parseInt(props.group.key));
      return (
        <div>
          <div className={styles.row} >
            <div style={{display:'inline-block'}}>
              <DetailsRowCheck canSelect={true} style={{float:'left'}}  selected={props.isSelected}  onClick={this._onToggleSelectGroup(props)} >
               </DetailsRowCheck>
              <TooltipHost content="select" id="tooltip1" style={{float:'left'}} calloutProps={calloutProps} styles={hostStyles}>
              <IconButton iconProps={props.group!.isCollapsed? TriangleSolidRight:TriangleSolidDown} title="Select" ariaLabel="Select" onClick={this._onToggleCollapse(props)}  /> 
              <div  style={{float:'right'}}>
              <ProgressIndicator    label={` ${props.group!.name}`}  percentComplete={progress} /> {progress} %
              </div>
              </TooltipHost>
            </div>
        </div> 
        </div>
      );
    }

    return null;
  };

  private _onRenderGroupFooter: IDetailsGroupRenderProps['onRenderFooter'] = props => {
    if (props) {
      return (
        <div >
          {/* <em>{`Custom footer for ${props.group!.name}`}</em> */}
        </div>
      );
    }

    return null;
  };

  private _onToggleCollapse(props: IGroupDividerProps): () => void {
    return () => {
      props!.onToggleCollapse!(props!.group!);
    };
  }
  private _onToggleSelectGroup(props: IGroupDividerProps): () => void {
    return () => {
      props.onToggleSelectGroup!(props.group!);
    };
  }

  private getGroupProgressPercent(key:number):number{
    let progress:number=0;
    let count=0;
    this._allItems.forEach((value:ITaskItem,index:number,array)=>{
        if(value.parentTaskId==key){
          progress+=value.progress;
          count++;
        }
    });
    return progress!=0?progress/count:0;
  }
  private loadData(currentContext:any,siteTaskUrl:string):Promise<ITaskItem[]>{
    return new Promise<ITaskItem[]>((resolve,reject)=>{
      try{
        const resultItems:ITaskItem[]=[];
        if(siteTaskUrl!=null && siteTaskUrl.trim()!=""){
          let requestUrl = siteTaskUrl.concat("/_api/web/Lists/GetByTitle('Team Tasks')/items?$select=*,AssignedTo/FirstName,AssignedTo/LastName,AssignedTo/Name,AssignedTo/Id,ParentID/Id&$expand=AssignedTo/Id,ParentID");
          currentContext.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
              .then((response: SPHttpClientResponse) => {
                  if (response.ok) {
                      response.json().then((responseJSON) => {
                          if (responseJSON!=null && responseJSON.value!=null){
                            console.log(responseJSON.value);
                              (responseJSON.value as any[]).forEach((value:any,index:number,array:any[])=>{
                                resultItems.push(
                                    {
                                      ID:value.ID,
                                      Title:value.Title,
                                      assignedTo:value.AssignedTo!=null&&value.AssignedTo.length>0? value.AssignedTo[0].FirstName+' '+value.AssignedTo[0].LastName : '',
                                      parentTaskId:value.ParentID!=null?value.ParentID.Id:-1,
                                      progress:value.PercentComplete*100
                                    }
                                  ); 
                              });
                            console.log(resultItems);
                          }
                          resolve(resultItems);
                      });
                  }
              });
        }
      }catch (error) {
        console.error(error);
        reject(error);
      }
    });

    
     
   }

}
