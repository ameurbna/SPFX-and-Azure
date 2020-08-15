import * as React from 'react';
import { useState } from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { IRecipe } from '../../models/IRecipe';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { RecipeContext } from '../../RecipeProvider';

const buttonStyles = { root: { marginRight: 8 } };

export interface IRecipeEditProps{
  status:boolean,
  recipe:IRecipe,
  saveAction:()=>void,
  cancelAction:()=>void
}
export interface IRecipeEditState{
  isOpen:boolean,
  recipe?:IRecipe
}
export default class RecipesEdit extends React.Component<IRecipeEditProps, IRecipeEditState> {
  static contextType=RecipeContext;
  constructor(props: IRecipeEditProps) {
    super(props);
    this.saveRecipe=this.saveRecipe.bind(this);
    this.cancelRecipe=this.cancelRecipe.bind(this);
    this.onRenderFooterContent=this.onRenderFooterContent.bind(this);
    this._onNameChangeText=this._onNameChangeText.bind(this);
    this._onDescChangeText=this._onDescChangeText.bind(this);
    this.state={
      isOpen:false
    }
    console.log("constructor status: "+props.status+" isOpen: "+this.state.isOpen);

  }
 
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isOpen:nextProps.status,
      recipe:nextProps.recipe
    };
   }

  componentDidMount(): void{
   
    console.log("componentDidMount status: "+this.props.status+" isOpen: "+this.state.isOpen);
  };
   saveRecipe = ()=>
  {
    const[recipes,setRecipes]=this.context;
    const index=(recipes as IRecipe[]).indexOf(this.props.recipe);
    if(index!=-1){
      recipes[index].name=this.state.recipe.name;
      recipes[index].description=this.state.recipe.description;
    }
    setRecipes(recipes);
    console.log(recipes);
    console.log("saveRecipe status: "+this.props.status+" isOpen: "+this.state.isOpen);
    this.props.saveAction();
    ///save data
  };

   cancelRecipe=()=>
  {
    console.log(" cancelRecipe status: "+this.props.status+" isOpen: "+this.state.isOpen);
    this.props.cancelAction();

    ///empty data
  };
  // This panel doesn't actually save anything; the buttons are just an example of what
  // someone might want to render in a panel footer.
   onRenderFooterContent = () => (
    <div>
      <PrimaryButton onClick={this.saveRecipe} styles={buttonStyles}>
        Save
      </PrimaryButton>
      <DefaultButton onClick={this.cancelRecipe}>Cancel</DefaultButton>
    </div>
  );
  private _onNameChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.state.recipe.name=text;
  };
  private _onDescChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.state.recipe.description=text;
  };
  public render(){
   
    const {isOpen,recipe}=this.state;
    console.log("render status: "+this.props.status+" isOpen: "+isOpen);
    return(
      <div>
      <Panel
        isOpen={isOpen}
        onDismiss={this.cancelRecipe}
        headerText={recipe!=null ? "Edit :"+ recipe.name : ""}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this.onRenderFooterContent}
        // Stretch panel content to fill the available height so the footer is positioned
        // at the bottom of the page
        isFooterAtBottom={true}
      >
        {recipe!=null?(
        <div>
        <TextField label="Name" value={recipe.name} onChange={this._onNameChangeText} />
        <TextField label="Description" onChange={this._onDescChangeText} value={recipe.description} multiline={true} autoAdjustHeight />
        <Image src={recipe.image}/>
        </div>
        )
        :
        (<span></span>)
        }
      </Panel>
    </div>
    );
  }
}
