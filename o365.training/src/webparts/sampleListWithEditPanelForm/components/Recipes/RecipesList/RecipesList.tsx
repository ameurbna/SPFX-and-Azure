import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import {IRecipe} from '../../models/IRecipe';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';
import RecipesEdit from '../RecipesEdit/RecipesEdit';
import RecipeServices from '../../services/RecipeServices';
import {RecipeContext} from '../../RecipeProvider';
import {useContext} from 'react';
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

export interface IDetailsListRecipesState {
  columns: IColumn[];
  items: IRecipe[];
  isModalSelection: boolean;
  isCompactMode: boolean;
  announcedMessage?: string;
  selectedRecipe?:IRecipe;
  editStatus?:boolean;
}



export default class RecipesList extends React.Component<{}, IDetailsListRecipesState> {
  static contextType=RecipeContext;
  
  private _selection: Selection;
  private _allItems: IRecipe[];
  private _overflowItems: ICommandBarItemProps[] = [
    { key: 'edit', text: 'Edit ...', onClick: (e) => this.openEditForm(e), iconProps: { iconName: 'Edit' } },
    { key: 'Delete', text: 'Delete...', onClick: (e) => console.log(e), iconProps: { iconName: 'Delete' } }
  ];
  private overflowProps: IButtonProps = { ariaLabel: 'More commands' };
  
  private openEditForm(e:any){
    console.log(e);
    // console.log(this.state.selectedRecipe);
    //console.log((this._selection.getSelection()[0] as IRecipe));
    if(this._selection.getSelectedCount()>0)
    this.setState({
      editStatus:true,
      selectedRecipe:(this._selection.getSelection()[0] as IRecipe)
    });
    
  }
  
  private saveRecipe=()=>{
    this.setState({
      editStatus:false,
      items:[...this.state.items]
    });
  }
  private cancelEditRecipe=()=>{
    this.setState({
      editStatus:false
    });
  }
  
  constructor(props: {}) {
    super(props);

    const res=RecipeServices.GetRecipes();
    //setRecipes(res);
    this._allItems =res;

    const columns: IColumn[] = [
      {
        key: 'column1',
        name: 'Name',
        fieldName: 'name',
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
        isPadded: true
      },
      {
        key: 'column3',
        name: 'Action',
        minWidth: 1,
        maxWidth: 40,
        isRowHeader: false,
        isResizable: false,
        isSorted: false,
        isSortedDescending: false,
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        onRender:this._onColumnActionRender
      },
      {
        key: 'column2',
        name: 'Picture',
        fieldName: 'image',
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
        onRender:this._onColumnRender

      }
    ];

    this._selection = new Selection({
      onSelectionChanged: () => {
       
        if(this._selection.getSelection().length>0)
        this.setState({
          selectedRecipe:(this._selection.getSelection()[0] as IRecipe),
          editStatus:false,
        });
    console.log(this.state.selectedRecipe);

      },
    });

    this.state = {
      items: this._allItems,
      columns: columns,
      isModalSelection: false,
      isCompactMode: false,
      announcedMessage: undefined,
      editStatus:false
    };
  }
public componentDidMount(){
  const[recipes,setRecipes]=this.context;
  if(recipes==null || (recipes!=null && recipes.length==0))
     setRecipes(this.state.items);
     else{
       this.setState({items:recipes});
     }
}
  public render() {
    const { columns, isCompactMode, items,editStatus,selectedRecipe } = this.state;

    return (
      <Fabric>
       <RecipesEdit recipe={selectedRecipe} status={editStatus} saveAction={this.saveRecipe} cancelAction={this.cancelEditRecipe}/>

        <div className={classNames.controlWrapper}>
          <Toggle
            label="Enable compact mode"
            checked={isCompactMode}
            onChange={this._onChangeCompactMode}
            onText="Compact"
            offText="Normal"
            styles={controlStyles}
          />
          <TextField label="Filter by name:" onChange={this._onChangeText} styles={controlStyles} />
        </div>
          <MarqueeSelection selection={this._selection}>
            <DetailsList useReducedRowRenderer={false}
              items={items}
              compact={isCompactMode}
              columns={columns}
              selectionMode={SelectionMode.single}
              selection={this._selection}
              getKey={this._getKey}
              layoutMode={DetailsListLayoutMode.justified}
              isHeaderVisible={true}
              selectionPreservedOnEmptyClick={true}
              onItemInvoked={this._onItemInvoked}
              enterModalSelectionOnTouch={true}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="Row checkbox"
            />
          </MarqueeSelection>
      </Fabric>
    );
  }
 

  public componentDidUpdate(previousProps: any, previousState: IDetailsListRecipesState) {
    if (previousState.isModalSelection !== this.state.isModalSelection && !this.state.isModalSelection) {
      this._selection.setAllSelected(false);
    }
  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }

  private _onChangeCompactMode = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
    this.setState({ isCompactMode: checked });
  };

  private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
    });
  };

  private _onItemInvoked(item: any): void {
    alert(`Item invoked: ${item.name}`);
  }

  private _onColumnRender=(item?: any, index?: number, column?: IColumn):any=>{
  return(
    <img src={item.image} className="img-responsive" alt="Responsive image" height="50"/>
  );
  }

  private _onColumnActionRender=(item?: any, index?: number, column?: IColumn):any=>{
    return(
    <div className="row">
      <CommandBar
          items={[]}
          overflowItems={this._overflowItems}
          overflowButtonProps={this.overflowProps}
          farItems={[]}
        />
    </div>
    );
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
  