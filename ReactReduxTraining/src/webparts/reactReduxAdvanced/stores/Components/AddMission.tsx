import * as React from 'react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { useConstCallback } from '@uifabric/react-hooks';
import { actionAddMission,actionOpenPanel, actionClosePanel } from '../actions';
import { connect } from 'react-redux';
import { AppState } from '../reduces';
import Mission from '../models/Mission';
import { Fabric } from 'office-ui-fabric-react/lib';

interface AddEditMissionProps{
  saveData: (newMission:Mission) => (newMission:Mission) => void;
  openPanel:() => () => void;
  closePanel:() => () => void;
  mission:Mission;
  state:string;
  errorMessage: string;
  isOpen:boolean;
}
interface AddEditMissionState{
  mission:Mission;
  state:string;
  errorMessage: string;
  isOpen:boolean;
}


export  class AddMission extends React.Component<AddEditMissionProps,AddEditMissionState> {
constructor(props: AddEditMissionProps , state : AddEditMissionState) {
      super(props,state);
      this.OnClick = this.OnClick.bind(this);
      this.dismissPanel = this.dismissPanel.bind(this);
      this.OnClickSave = this.OnClickSave.bind(this);
      this.handleChangeTitle = this.handleChangeTitle.bind(this);
      this.handleChangeDesc = this.handleChangeDesc.bind(this);
      this.handleChangeLoca = this.handleChangeLoca.bind(this);

    }
     public buttonStyles = { root: { margin: 8 } };

  // TextFields don't have to be inside Stacks, we're just using Stacks for layout
  public onRenderFooterContent = () => (
    <div>
      <PrimaryButton onClick={this.OnClickSave} >
        Enregistrer
      </PrimaryButton>
      <DefaultButton onClick={this.dismissPanel} >Annuler</DefaultButton>
    </div>
  )
   public dismissPanel () {
    this.props.closePanel();
  }
  public handleChangeTitle =(text: string): void => {
    this.props.mission.Title=text;
  }
  public handleChangeDesc=(text: string): void => {
    this.props.mission.Description=text;
  }
  public handleChangeLoca=(text: string): void => {
    this.props.mission.Location=text;
  }

  public OnClickSave() {

    this.props.saveData(this.props.mission);
  }

  public OnClick() {
    this.props.openPanel();
  }
  // TextFields don't have to be inside Stacks, we're just using Stacks for layout
  public render() : React.ReactElement<AddEditMissionProps> {

    return (
      <Fabric >
      <DefaultButton text="Nouveau"  onClick={this.OnClick}   />
       <Panel
       isOpen={this.props.isOpen}
        onDismiss={this.dismissPanel}
        headerText="Fiche de mission"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this.onRenderFooterContent}
        isFooterAtBottom={true}
      >
          <TextField name="titreF" label="Titre" placeholder="Titre"  onChanged={this.handleChangeTitle} />
          <TextField name="localisationF" label="Localisation" onChanged={this.handleChangeLoca} required />
          <TextField name="descriptionF" label="Description" onChanged={this.handleChangeDesc}  multiline rows={20} required />
        </Panel>
    </Fabric>
  );
  }
}

const mapStateToProps = (appstate: AppState, ownProps:AddEditMissionProps) => {
  return {
    state: appstate.list.state,
    errorMessage: appstate.list.errorMessage,
    mission:appstate.list.mission,
    isOpen:appstate.list.isOpen
  };
};

const mapDispatchToProps = (dispatch: any) => { // tslint:disable-line
  return {
    saveData: (mission) => dispatch(actionAddMission(mission)),
    openPanel:()=>dispatch(actionOpenPanel(dispatch)),
    closePanel:()=>dispatch(actionClosePanel(dispatch))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMission);

