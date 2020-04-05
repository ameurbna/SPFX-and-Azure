import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import  IBook  from '../store/models/IBook';
import { actionFetchBooks } from '../store/actions';
import { connect } from 'react-redux';
import { AppState } from '../store/reduces';

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
});
const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '300px',
  },
};

export interface IBookGridState {
  columns: IColumn[];
  items: IBook[];
  selectionDetails: string;
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
  searchText?:string;
}


interface IBookGridProps {
  loadData: () => () => void;
  books: IBook[];
  state: string;
  errorMessage?: string;
}
export class BooksGrid extends React.Component<IBookGridProps, IBookGridState> {
  private _selection: Selection;
  private _allItems: IBook[];

  constructor(props: IBookGridProps,state: IBookGridState) {
    super(props,state);


    const columns: IColumn[] = [
      {
        key: 'Title',
        name: 'Title',
        ariaLabel: 'Column operations for book title, Press to sort on title',
        fieldName: 'Title',
        minWidth: 200,
        maxWidth: 250,
        onColumnClick: this._onColumnClick,
      },
      {
        key: 'Author',
        name: 'Author',
        fieldName: 'Author',
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
        key: 'Price',
        name: 'Price',
        fieldName: 'Price',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'number',
        onRender: (item: IBook) => {
          return <span>{item.Price}</span>;
        },
        isPadded: true,
      },
      {
        key: 'Summary',
        name: 'Summary',
        fieldName: 'Summary',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsable: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
        onRender: (item: IBook) => {
          return <span>{item.Summary}</span>;
        },
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
      items: this._allItems,
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
  public render() {
    const _items= this.state.searchText ? this.props.books.filter(i => i.Title.toLowerCase().indexOf(this.state.searchText) > -1) :this.props.books;

    const { columns, isCompactMode, selectionDetails, isModalSelection, announcedMessage } = this.state;
    if (this.props.state === 'LOADING') {
      return (<p>Loading ...</p>);
    } else if (this.props.state === 'ERROR') {
      return (<p>Error: {this.props.errorMessage}</p>);
    } else if (this.props.state === 'Succes'||this.props.state === 'Open'||this.props.state === 'Close'||this.props.state ==='Saved') {

    return (
      <Fabric>
        <div className={classNames.controlWrapper}>
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
          <TextField label="Filter by name:" onChanged={this._onChangeText}  />
        </div>
        <div className={classNames.selectionDetails}>{selectionDetails}</div>
        {isModalSelection ? (
          <MarqueeSelection selection={this._selection}>
            <DetailsList
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
          <DetailsList
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

  public componentDidUpdate(previousProps: any, previousState: IBookGridState) {
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

  private _onChangeModalSelection = ( checked: boolean): void => {
    this.setState({ isModalSelection: checked });
  };

  private _onChangeText = ( text: string): void => {
    this.setState({
      searchText:text
    });
  };

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IBook).Author;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
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
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems,
    });
  };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
const mapStateToProps = (state: AppState, ownProps: IBookGridProps) => {
  return {
    books: state.list.Books,
    state: state.list.state,
    errorMessage: state.list.errorMessage
  };
};

const mapDispatchToProps = (dispatch: any) => { // tslint:disable-line
  return {
    loadData: () => dispatch(actionFetchBooks())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BooksGrid);
