import * as React from 'react';
import styles from './SampleListWithEditPanelForm.module.scss';
import { ISampleListWithEditPanelFormProps } from './ISampleListWithEditPanelFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import RecipesList from './Recipes/RecipesList/RecipesList';
import {RecipeProvider} from './RecipeProvider';
export default class SampleListWithEditPanelForm extends React.Component<ISampleListWithEditPanelFormProps, {}> {
  public render(): React.ReactElement<ISampleListWithEditPanelFormProps> {
    
    //   const result=this.props.context.sdks.microsoftTeams!=null?<div>hello teams</div>:<RecipeProvider>
    //   <RecipesList/>
    //   </RecipeProvider>;
    // return (
    //   <div>
    //       {result}
    //   </div>
    // );
    return(
      <RecipeProvider>
      <RecipesList/>
      </RecipeProvider>
    );
  }
}
