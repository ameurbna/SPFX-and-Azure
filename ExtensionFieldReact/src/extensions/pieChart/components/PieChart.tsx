import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';
import styles from './PieChart.module.scss';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { useConstCallback } from '@uifabric/react-hooks';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';

export interface IPieChartProps {
  text: string;
  listItem:any;
}
export interface IPieChartState {
  isOpen: boolean;
}
const LOG_SOURCE: string = 'PieChart';

export default class PieChart extends React.Component<IPieChartProps, IPieChartState> {
  constructor(props: IPieChartProps,state : IPieChartState) {
    super(props,state);
    this.openPanel=this.openPanel.bind(this);
    this.dismissPanel=this.dismissPanel.bind(this);
  }
  public openPanel (){
    this.setState({
      isOpen:true
    });
    }
    public dismissPanel (){
      this.setState({
        isOpen:false
      });
      }
  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: PieChart mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: PieChart unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {
    let fieldsTitle:string[]=[];
    let fieldsValues:number[]=[];
    this.props.listItem.fields.forEach(element => {
      if(element.fieldType=="Number" && element.internalName!="SPFxRapport"){
        fieldsTitle.push(element.displayName);
        fieldsValues.push(parseInt(this.props.listItem.getValueByName(element.internalName)));
      }
    });

    const data: Chart.ChartData = {
      labels:fieldsTitle,
      datasets: [
        {
          label: 'Statistics',
          data:fieldsValues
        }
      ]
    };

    // set the options
    const options: Chart.ChartOptions = {
      legend: {
        display: true,
        position: "bottom"
      },
      title: {
        display: true,
        text: "Statistics"
      },
    };
    return (
      <div className={styles.cell}>
         <DefaultButton text="Show Report" onClick={this.openPanel} />
          <Panel
            headerText="Report"
            isOpen={this.state!=null?this.state.isOpen:false}
            onDismiss={this.dismissPanel}
            closeButtonAriaLabel="Close"
            type={PanelType.medium}
          >
            <ChartControl
              type={ChartType.Pie}
              data={data}
              options={options}
            />
      </Panel>
      </div>
    );
  }
}
