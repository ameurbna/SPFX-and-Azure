import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel,PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import SunEditor from 'suneditor-react';
require('suneditor/dist/css/suneditor.min.css'); // Import Sun Editor's CSS File
import { sp, EmailProperties } from "@pnp/sp";


export interface IPanelSendProps{
  showPanel?:()=>void;
  hidePanel?:()=>void;
  mailBody?:string;
}
export interface IPanelSendState{
  subject?:string;
  emailTo?:string;
  mailBody?:string;
 isOpen:boolean;
}
const buttonStyles = { root: { marginRight: 8 } };

export default class PanelSendEmail extends React.Component<IPanelSendProps, IPanelSendState> {
  constructor(props: IPanelSendProps,state : IPanelSendState) {
    super(props,state);
    this.HidePanel=this.HidePanel.bind(this);
    this.ShowPanel=this.ShowPanel.bind(this);
    this.SendEmail=this.SendEmail.bind(this);
    this.handleChangeToEmail=this.handleChangeToEmail.bind(this);
    this.handleChangeSubject=this.handleChangeSubject.bind(this);
    this.handleChangeBody=this.handleChangeBody.bind(this);
    props.hidePanel=this.HidePanel;
    props.showPanel=this.ShowPanel;
  }

  public componentDidMount(): void {
  }

  public componentWillUnmount(): void {
  }
  public ShowPanel():void{
    this.setState({
      isOpen:true,
      mailBody:this.props.mailBody
    });
  }
  public HidePanel():void{
    this.setState({
      isOpen:false
    });
  }
  public SendEmail():void{
     sp.utility.getCurrentUserEmailAddresses().then((addressString: string) => {
      const emailProps: EmailProperties = {
        To: [this.state.emailTo],
        Subject: this.state.subject,
        Body: this.state.mailBody,
        From: addressString
    };

    sp.utility.sendEmail(emailProps).then(_ => {
      this.setState({
        isOpen:false
      });
        console.log("Email Sent!");
    }).catch(e=>{
      alert(e);
    });
  });


  }
  public onChange(text:string):void{

  }
  public handleChangeToEmail(text: string): void  {
    this.setState({
      emailTo:text
    });
  }
  public handleChangeSubject(text: string): void {
    this.setState({
      subject:text
    });
  }
  public handleChangeBody (text: string): void  {
    this.setState({
      mailBody:text
    });
  }
  public  onRenderFooterContent = () => (
    <div>
      <PrimaryButton onClick={this.SendEmail} styles={buttonStyles}>
        Envoyer
      </PrimaryButton>
      <DefaultButton onClick={this.HidePanel}>Annuler</DefaultButton>
    </div>
  );
  public render(): React.ReactElement<{}> {

    return (
      <Panel
        isOpen={this.state!=null?this.state.isOpen:false}
        headerText="Outlook Send Mail"
        closeButtonAriaLabel="Close"
        onDismiss={this.HidePanel}
        isFooterAtBottom={true}
        type={PanelType.medium}
        onRenderFooterContent={this.onRenderFooterContent}
      >
        <TextField label="TO: " required onChanged={this.handleChangeToEmail} />
        <br/>
        <TextField label="Subject: " required onChanged={this.handleChangeSubject} />
        <br/>
        <Label htmlFor={"bodyMessahe"}>Message: </Label>
        <SunEditor setContents={this.state!=null?this.state.mailBody:""} onChange={this.handleChangeBody}/>
      </Panel>
    );
  }
}
