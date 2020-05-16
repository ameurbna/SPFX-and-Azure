Dans ce tutoriel nous allons apprendre à  développer des applications React avec une gestion des State grâce à redux

 



On va créer une liste avec un champ de recherche pour filtrer et on va ajouter un formulaire pour créer de nouvelle entrée

Les composants qu'on va utiliser sont des control ui office fabric

UI Office Fabric



Comme prérequis je vous invite à consulter la doc Microsoft pour la préparation de développement SharePoint Framework

préparation d’environnement de développement



Commençons par créer notre solution spfx:



>md ReactReduxSample



>yo @microsoft/sharepoint

Choisissez "SharePoint Online Only"



Puis "Use current folder"



ensuite "WebPart"



Nom de la webpart "ReactReduxTraining"



Framework React



Solution initié





Lancer Vscode avec la commande suivante 

> code .





Voila la solution est créé 

On va créer l'arborescence des dossiers suivants



On installe ui office fabric


npm install --save office-ui-fabric-react@5.135.0








On créé le premier composant "BooksGrid":















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

import Data from '../store/services/Data';

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

}

export interface IBook {

  Title: string;

  Author: string;

  Price: string;

  Summary: string;

}

export class BooksGrid extends React.Component<{}, IBookGridState> {

  private _selection: Selection;

  private _allItems: IBook[];

  constructor(props: {}) {

    super(props);

    this._allItems = Data;

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

  public render() {

    const { columns, isCompactMode, items, selectionDetails, isModalSelection, announcedMessage } = this.state;

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

              items={items}

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

            items={items}

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

      items: text ? this._allItems.filter(i => i.Author.toLowerCase().indexOf(text) > -1) : this._allItems,

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




On va ajouter une liste d'objet Book pour l'utiliser comme source de donnée

const Data=[

  {

    Title: "Power React",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "WebApi asp.net",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "c#",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "Wcf",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "xml",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "Sharepoint Framework",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "Typescript Node JS",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "Angular JS",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  },

  {

    Title: "React",

    Author: "It's me :)",

    Price: "100$",

    Summary: "Ut tempor leo vitae interdum pharetra. Maecenas in vehicula ante, vitae condimentum orci. Vivamus commodo, risus at auctor tincidunt, dui ipsum placerat libero, ut pretium nisi turpis ut odio. Proin commodo tincidunt aliquam. Aliquam vitae felis non massa laoreet elementum. Nunc efficitur nisi et euismod vestibulum. Nam tincidunt, mi vitae sagittis posuere, ante dui ullamcorper felis, dictum lacinia eros lectus eu lacus. Donec in consequat ex, sed dignissim augue."

  }

];

export default Data;









Modifier le composant "ReactReduxTraining.tsx"



import * as React from 'react';

import styles from './ReactReduxTraining.module.scss';

import { IReactReduxTrainingProps } from './IReactReduxTrainingProps';

import { escape } from '@microsoft/sp-lodash-subset';

import {BooksGrid} from './BooksGrid';

export default class ReactReduxTraining extends React.Component<IReactReduxTrainingProps, {}> {

  public render(): React.ReactElement<IReactReduxTrainingProps> {

    return (

      <BooksGrid/>

    );

  }

}





>gulp serve











On ajoute un 2ieme compoant AddBook.tsx







import * as React from 'react';

import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import { Panel } from 'office-ui-fabric-react/lib/Panel';

import { useConstCallback } from '@uifabric/react-hooks';

import { TextField } from 'office-ui-fabric-react/lib/TextField';



const buttonStyles = { root: { marginRight: 8 } };

interface IAddBookState{

  isOpen:boolean

}

//export class BooksGrid extends React.Component<{}, IBookGridState> {

export class AddBook extends React.Component<{}, IAddBookState> {

  constructor(props: {},state : IAddBookState) {

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

  // This panel doesn't actually save anything; the buttons are just an example of what

  // someone might want to render in a panel footer.

  public  onRenderFooterContent = () => (

    <div>

      <PrimaryButton onClick={this.dismissPanel} styles={buttonStyles}>

        Enregistrer

      </PrimaryButton>

      <DefaultButton onClick={this.dismissPanel}>Annuler</DefaultButton>

    </div>

  );

public render(){

  return (

    <div>

      <DefaultButton text="Open panel" onClick={this.openPanel} />

      <Panel

        isOpen={this.state!=null?this.state.isOpen:false}

        onDismiss={this.dismissPanel}

        headerText="Panel with footer at bottom"

        closeButtonAriaLabel="Close"

        onRenderFooterContent={this.onRenderFooterContent}

        // Stretch panel content to fill the available height so the footer is positioned

        // at the bottom of the page

        isFooterAtBottom={true}

      >

         <TextField label="Title " required />

         <TextField label="Summury " multiline rows={20}  required />

         <TextField label="Author "  required />

         <TextField label="Price "  required />



      </Panel>

    </div>

  );

}

}



On modifie encore ReactReduxTraining.tsx



import * as React from 'react';

import styles from './ReactReduxTraining.module.scss';

import { IReactReduxTrainingProps } from './IReactReduxTrainingProps';

import { escape } from '@microsoft/sp-lodash-subset';

import {BooksGrid} from './BooksGrid';

import {AddBook} from './AddBook';

export default class ReactReduxTraining extends React.Component<IReactReduxTrainingProps, {}> {

  public render(): React.ReactElement<IReactReduxTrainingProps> {

    return (

      <div>

      <BooksGrid/>

      <AddBook/>

      </div>

    );

  }

}



On teste le rendu : >gulp serve







Revenons vers le dossier store:

On ajoute un dossier model dans "store" puis on ajoute notre modèle "IBook"

export interface IBook {

  Title: string;

  Author: string;

  Price: string;

  Summary: string;

}



Dans le dossier services on ajoute une class BooksServices







import Data from './Data';

import { IBook } from '../models/IBook';





export default class MissionServices{

   public static getAllBooks():Promise<IBook[]> {

    return  new Promise((resolve, reject) => {

      resolve(Data);

    });

  }

  public static AddBook(newBook:IBook):Promise<IBook[]> {

    return  new Promise((resolve, reject) => {

      try {

        (<IBook[]> Data).push(newBook);

        resolve(Data);

      } catch (error) {

        reject(error);

      }



    });

  }

  public static AddNewBook():Promise<IBook> {

    return  new Promise((resolve, reject) => {

      try {

        let newBook:IBook={

          Title: "",

          Author: "",

          Price: "",

          Summary: ""

        } ;

        resolve(newBook);

      } catch (error) {

        reject(error);

      }



    });

  }





}





Dans le dossier action on définir les actions nécessaires pour manipuler les données:

commençons par ajouter Redux à notre projet

npm install --save redux
npm install --save react-redux
npm install --save redux-thunk

Ajouter un fichier index.ts dans le dossier "actions"
import { Action, Dispatch } from 'redux';

import {IBook} from '../models/IBook';

import BookServices from '../services/BookServices';

export const ACTION_BOOK_FETCH ='BOOK_FETCH';

export const ACTION_BOOK_FETCH_SUCCESS ='BOOK_FETCH_SUCCESS';

export const ACTION_BOOK_FETCH_ERROR ='BOOK_FETCH_ERROR';

export const ACTION_BOOK_ADD ='BOOK_ADD';

export const ACTION_BOOK_ADD_SUCCESS ='BOOK_ADD_SUCCESS';

export const ACTION_BOOK_ADD_ERROR ='BOOK_ADD_ERROR';

export const ACTION_OPEN_PANEL ='OPEN_PANEL';

export const ACTION_CLOSE_PANEL ='CLOSE_PANEL';

export interface IActionBookFetch extends Action {

  type: string;

}

export interface IActionBookFetchSuccess extends Action {

  type: string;

  IBooks: IBook[];

}

export interface IActionBookFetchError extends Action {

  type: string;

  errorMessage: string;

}

export interface IActionOpenPanel extends Action {

  type: string;

}

export interface IActionClosePanel extends Action {

  type: string;

}

export interface IActionBookAdd extends Action {

  type: string;

}

export interface IActionBookAddSuccess extends Action {

  type: string;

  IBooks: IBook[];

}

export interface IActionBookAddError extends Action {

  type: string;

  errorMessage: string;

}

function dispatchFetchBookProgress(): IActionBookFetch {

  return {

    type: ACTION_BOOK_FETCH

  };

}

function dispatchFetchBooksSuccess(IBooks: IBook[]): IActionBookFetchSuccess {

  return {

    type: ACTION_BOOK_FETCH_SUCCESS,

    IBooks: IBooks

  };

}

function dispatchFetchBooksError(e: Error): IActionBookFetchError {

  return {

    type: ACTION_BOOK_FETCH_ERROR,

    errorMessage: e.message

  };

}

function dispatchAddBookProgress(): IActionBookAdd {

  return {

    type: ACTION_BOOK_ADD

  };

}

function dispatchAddBookSucess(IBooks: IBook[]): IActionBookAddSuccess {

  return {

    type: ACTION_BOOK_ADD_SUCCESS,

    IBooks:IBooks

  };

}

function dispatchAddIBookError(error): IActionBookAddError {

  return {

    type: ACTION_BOOK_ADD_ERROR,

    errorMessage:error

  };

}

function dispatchOpenPanel(): IActionOpenPanel {

  return {

    type: ACTION_OPEN_PANEL

  };

}

function dispatchClosePanel(): IActionClosePanel {

  return {

    type: ACTION_CLOSE_PANEL

  };

}

export function actionFetchBooks() {

  return (dispatch: Dispatch) => {

    dispatch(dispatchFetchBookProgress());

    return BookServices.getAllBooks()

    .then((IBooks) => {

      return dispatch(dispatchFetchBooksSuccess(IBooks));

    })

    .catch((e: Error) => {

      return dispatch(dispatchFetchBooksError(e));

    });

  };

}

export function actionAddBook(newIBook:IBook) {

  return (dispatch: Dispatch) => {

    dispatch(dispatchAddBookProgress());

    return BookServices.AddBook(newIBook)

    .then((res) => {

      return dispatch(dispatchAddBookSucess(res));

    })

    .catch((e: Error) => {

      return dispatch(dispatchFetchBooksError(e));

    });

  };

}

export function actionOpenPanel(dispatch: Dispatch) {

     return dispatch(dispatchOpenPanel());

}

export function actionClosePanel(dispatch: Dispatch) {

 return dispatch(dispatchClosePanel());

}

export type AppsAction=IActionClosePanel|IActionOpenPanel|IActionBookFetch|IActionBookFetchError|IActionBookFetchSuccess|IActionBookAdd|IActionBookAddError|IActionBookAddSuccess;




Dans le dossier reduces on ajoute un fichier index.ts  pour définir les reduces
import { IActionBookFetchSuccess, ACTION_BOOK_FETCH_ERROR, ACTION_BOOK_ADD, ACTION_BOOK_ADD_SUCCESS, ACTION_BOOK_ADD_ERROR, IActionBookAddError, ACTION_CLOSE_PANEL, IActionBookAddSuccess } from './../actions/index';

import { AppsAction, ACTION_OPEN_PANEL, ACTION_BOOK_FETCH, ACTION_BOOK_FETCH_SUCCESS } from '../actions';

import {IBook} from '../models/IBook';

import { Action } from 'redux';

export interface ListIBookState{

  state: string;

  Books: IBook[];

  errorMessage?: string;

  Book?:IBook;

}

export function defaultIBooksListState() {

  return {

    state: 'INIT',

    IBooks: [],

    isOpen:false,

  };

}

export function BooksListReducer(state: ListIBookState, action: AppsAction): ListIBookState {

  if (action.type === ACTION_BOOK_FETCH) {

    return {

      ...state,

      state: 'Loading',

      Books: []

    };

  }

  if (action.type === ACTION_BOOK_FETCH_SUCCESS) {

    return {

      ...state,

      state: 'Succes',

      Books: (<IActionBookFetchSuccess>action).IBooks

    };

  }

  if (action.type === ACTION_BOOK_FETCH_ERROR) {

    return {

      ...state,

      state: 'Error',

      Books: [],

    };

  }

  if (action.type === ACTION_BOOK_ADD) {

    return {

      ...state,

      state: 'Saving',

      Books: []

    };

  }

  if (action.type === ACTION_BOOK_ADD_SUCCESS) {

    return {

      ...state,

      state: 'Saved',

      Books: (<IActionBookAddSuccess>action).IBooks,

    };

  }

  if (action.type === ACTION_BOOK_ADD_ERROR) {

    return {

      ...state,

      state: 'ERROR',

      Books: [],

      errorMessage:  (<IActionBookAddError>action).errorMessage

    };

  }

  return state;

}

export function defaultBookListState() {

  return {

    state: "INIT",

  Books: [],

  };

}

export interface AppState {

    list: ListIBookState;

}

export function defaultState() {

  return {

    list: defaultBookListState()

  };

}

export function mainReducer(state: AppState = defaultState(), action: Action) {

  return {

    list: BooksListReducer(state.list, action)

  };

}




On va connecter les controls qu'on a déjà développé avec les actions et les reduces



commençons par le controle BooksGrid.tsx

avec les méthodes mapStateToProps

mapDispatchToProps

connect





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







On revient à "ReactReduxTraining.tsx" pour créer le store



import * as React from 'react';

import styles from './ReactReduxTraining.module.scss';

import { IReactReduxTrainingProps } from './IReactReduxTrainingProps';

import { escape } from '@microsoft/sp-lodash-subset';

import BooksGrid from './BooksGrid';

import {AddBook} from './AddBook';

import { Provider } from 'react-redux';

import { createStore, applyMiddleware } from 'redux';

import { mainReducer, defaultState } from '../store/reduces';

import thunk from 'redux-thunk';

const store = createStore(mainReducer, defaultState(), applyMiddleware(thunk));



export default class ReactReduxTraining extends React.Component<IReactReduxTrainingProps, {}> {

  public render(): React.ReactElement<IReactReduxTrainingProps> {

    return (

      <div>

     <Provider store={store}>

          <BooksGrid/>

          <AddBook/>

      </Provider>

      </div>

    );

  }

}



  





On va connecter le composant AddBooks.tsx



import * as React from 'react';

import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import { Panel } from 'office-ui-fabric-react/lib/Panel';

import { TextField } from 'office-ui-fabric-react/lib/TextField';

import IBook from '../store/models/IBook';

import { actionAddBook } from '../store/actions';

import { connect } from 'react-redux';

import { AppState } from '../store/reduces';



const buttonStyles = { root: { marginRight: 8 } };

interface IAddBookProps{

  saveData: (newBook:IBook) => (newBook:IBook) => void,

}

interface IAddBookState{

  isOpen:boolean;

  book:IBook;

}

//export class BooksGrid extends React.Component<{}, IBookGridState> {

export class AddBook extends React.Component<IAddBookProps, IAddBookState> {

  constructor(props: IAddBookProps,state : IAddBookState) {

    super(props,state);

    this.openPanel=this.openPanel.bind(this);

    this.dismissPanel=this.dismissPanel.bind(this);

    this.SaveBook=this.SaveBook.bind(this);

    this.handleChangeTitle=this.handleChangeTitle.bind(this);

    this.handleChangeAuthor=this.handleChangeAuthor.bind(this);

    this.handleChangeSummary=this.handleChangeSummary.bind(this);

    this.handleChangePrice=this.handleChangePrice.bind(this);

  }

  public handleChangeTitle =(text: string): void => {

    this.state.book.Title=text;

  }

  public handleChangeSummary=(text: string): void => {

    this.state.book.Summary=text;

  }

  public handleChangeAuthor=(text: string): void => {

    this.state.book.Author=text;

  }

  public handleChangePrice=(text: string): void => {

    this.state.book.Price=text;

  }

public openPanel (){

this.setState({

  isOpen:true,

    book:{

    Title:"",

    Summary:"",

    Price:"",

    Author:""

  }

});

}

public dismissPanel (){

  this.setState({

    isOpen:false

  });

}

public SaveBook (){

  this.setState({

    isOpen:false

  });

this.props.saveData(this.state.book);

}

  // This panel doesn't actually save anything; the buttons are just an example of what

  // someone might want to render in a panel footer.

  public  onRenderFooterContent = () => (

    <div>

      <PrimaryButton onClick={this.SaveBook} styles={buttonStyles}>

        Enregistrer

      </PrimaryButton>

      <DefaultButton onClick={this.dismissPanel}>Annuler</DefaultButton>

    </div>

  );

public render(){

  return (

    <div>

      <DefaultButton text="New book" onClick={this.openPanel} />

      <Panel

        isOpen={this.state!=null?this.state.isOpen:false}

        onDismiss={this.dismissPanel}

        headerText="Panel with footer at bottom"

        closeButtonAriaLabel="Close"

        onRenderFooterContent={this.onRenderFooterContent}

        // Stretch panel content to fill the available height so the footer is positioned

        // at the bottom of the page

        isFooterAtBottom={true}

      >

         <TextField label="Title " required onChanged={this.handleChangeTitle}/>

         <TextField label="Summury " multiline rows={20}  required onChanged={this.handleChangeSummary}/>

         <TextField label="Author "  required onChanged={this.handleChangeAuthor}/>

         <TextField label="Price "  required onChanged={this.handleChangePrice}/>



      </Panel>

    </div>

  );

}

}



const mapStateToProps = (state: AppState, ownProps: IAddBookProps) => {

  return {

    books: state.list.Books,

    state: state.list.state,

    errorMessage: state.list.errorMessage

  };

};



const mapDispatchToProps = (dispatch: any) => { // tslint:disable-line

  return {

    saveData: (newBook:IBook)  => dispatch(actionAddBook(newBook))

  };

};



export default connect(mapStateToProps, mapDispatchToProps)(AddBook);



>gulp serve







Code source : https://github.com/ameurbna/SPFX.git

