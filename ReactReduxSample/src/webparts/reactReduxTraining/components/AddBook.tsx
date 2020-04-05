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
