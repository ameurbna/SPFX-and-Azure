import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { actionFetchMissions } from '../actions';
import { connect } from 'react-redux';
import { AppState } from '../reduces';

import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import Mission from '../models/Mission';
import Data from '../services/Data';
const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden',
      },
    },
  },
  fileIconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px',
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  exampleToggle: {
    display: 'inline-block',
    marginBottom: '10px',
    marginRight: '30px',
  },
  selectionDetails: {
    marginBottom: '20px',
  },
  detailList:{
    height:'400px'
  }
});
const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '300px',
  },
};

 interface IDetailsListMissionsState {
  columns: IColumn[];
  missions: Mission[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
  searchText?:string;
}
interface DetailsListMissionsProps {
  loadData: () => () => void;
  missions: Mission[];
  state: string;
  errorMessage?: string;
}

export class DetailsListMissions extends React.Component<DetailsListMissionsProps, IDetailsListMissionsState> {
  private _selection: Selection;
  private _allItems: Mission[];

  constructor(props: DetailsListMissionsProps , state : IDetailsListMissionsState) {
    super(props,state);

    this._onChangeText = this._onChangeText.bind(this);

    const columns: IColumn[] = [
      {
        key: 'ID',
        name: 'ID',
        className: classNames.fileIconCell,
        iconClassName: classNames.fileIconHeaderIcon,
        ariaLabel: 'Identifiant',
        fieldName: 'id',
        data:"number",
        minWidth: 16,
        maxWidth: 16,
        onColumnClick: this._onColumnClick
      },
      {
        key: 'Title',
        name: 'Title',
        fieldName: 'Title',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'Description',
        name: 'Description',
        fieldName: 'Description',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'Location',
        name: 'Location',
        fieldName: 'Location',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsable: true,
        data: 'string',
        isPadded: true,
      },

    ];

    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
        });
      },
    });

    this.state = {
      missions: this.props.missions,
      columns: columns,
      selectionDetails: this._getSelectionDetails(),
      isModalSelection: false,
      isCompactMode: false,
      announcedMessage: undefined,
    };
  }
  public componentDidMount() {
    if (this.props.state === 'INIT') {
      this.props.loadData();
    }
  }
  private _onChangeText = (text: string): void => {
    this.setState({
      searchText:text
    });
  }

  public render() {
    const _items= this.state.searchText ? this.props.missions.filter(i => i.Title.toLowerCase().indexOf(this.state.searchText) > -1) :this.props.missions;

    const { columns, isCompactMode, selectionDetails, isModalSelection, announcedMessage } = this.state;
    if (this.props.state === 'LOADING') {
      return (<p>Loading ...</p>);
    } else if (this.props.state === 'ERROR') {
      return (<p>Error: {this.props.errorMessage}</p>);
    } else if (this.props.state === 'Succes'||this.props.state === 'Open'||this.props.state === 'Close'||this.props.state ==='Saved') {
    return (
      <Fabric >
        <div className={classNames.controlWrapper} >
          <Toggle
            label="Enable compact mode"
            checked={isCompactMode}
            onChanged={this._onChangeCompactMode}
            onText="Compact"
            offText="Normal"
            styles={controlStyles}
          />
          <Toggle
            label="Enable modal selection"
            checked={isModalSelection}
            onChanged={this._onChangeModalSelection}
            onText="Modal"
            offText="Normal"
            styles={controlStyles}
          />
          <TextField label="Filter by Title:" onChanged={this._onChangeText}  />
        </div>
        <div className={classNames.selectionDetails}>{selectionDetails}</div>
        {isModalSelection ? (
        <MarqueeSelection selection={this._selection} style={{height:'300px'}} >
            <DetailsList className={classNames.detailList}
              items={_items}
              compact={isCompactMode}
              columns={columns}
              selectionMode={SelectionMode.multiple}
              getKey={this._getKey}
              setKey="multiple"
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
              selection={this._selection}
              selectionPreservedOnEmptyClick={true}
              onItemInvoked={this._onItemInvoked}
              enterModalSelectionOnTouch={true}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="Row checkbox"
            />
          </MarqueeSelection>
        ) : (
          <DetailsList className={classNames.detailList}
            items={_items}
            compact={isCompactMode}
            columns={columns}
            selectionMode={SelectionMode.none}
            getKey={this._getKey}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onItemInvoked={this._onItemInvoked}
          />
        )}
      </Fabric>
    );
        }else{
          return <Fabric>Loading</Fabric>;
        }
  }

  public componentDidUpdate(previousProps: any, previousState: IDetailsListMissionsState) {
    if (previousState.isModalSelection !== this.state.isModalSelection && !this.state.isModalSelection) {
      this._selection.setAllSelected(false);
    }
  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }

  private _onChangeCompactMode = (checked: boolean): void => {
    this.setState({ isCompactMode: checked });
  }

  private _onChangeModalSelection = (checked: boolean): void => {
    this.setState({ isModalSelection: checked });
  }


  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as Mission).Title;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, missions } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
        this.setState({
          announcedMessage: `${currColumn.name} is sorted ${
            currColumn.isSortedDescending ? 'descending' : 'ascending'
          }`,
        });
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(this.props.missions, currColumn.fieldName!, currColumn.isSortedDescending);

  }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

const mapStateToProps = (state: AppState, ownProps: DetailsListMissionsProps) => {
  return {
    missions: state.list.missions,
    state: state.list.state,
    errorMessage: state.list.errorMessage
  };
};

const mapDispatchToProps = (dispatch: any) => { // tslint:disable-line
  return {
    loadData: () => dispatch(actionFetchMissions())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailsListMissions);
