import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from '@microsoft/sp-http';
import * as React from 'react';
import {Navbar,Nav,NavDropdown,Form,FormControl,Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {LinkItem} from '../models/LinkItem'
export interface IMenuCmpProps{
  loadMenu?: (ct:any) => Promise<LinkItem[]>;
  currentContext:any;
}
interface IMenuCmpState{
 links:LinkItem[]
}
export class MenuCmp extends React.Component<IMenuCmpProps, IMenuCmpState> {
  constructor(props: IMenuCmpProps,state : IMenuCmpState) {
    super(props,state);
    state.links=[];
    props.loadMenu=this.loadData;
    }

  public componentDidMount() {
    this.props.loadMenu(this.props.currentContext).then(result=>{
      this.setState({
        links:result
        });
    });

  }
  private renderDrp(item:LinkItem):JSX.Element{
  const listItems =item.SubLinks.map((link) =>{
   return  <NavDropdown.Item href={link.Href}>{link.Text}</NavDropdown.Item>;
  });
    return (
    <NavDropdown title={item.Text} id="basic-nav-dropdown">
      {listItems}
    </NavDropdown>
    );
  }
public render(){
  const listItems =this.state!=null? this.state.links.map((link) =>{
   return (link.Type=="Nav.Link"? <Nav.Link href="#home">{link.Text}</Nav.Link> : this.renderDrp(link)) ;
  }
):<div></div>;
      return (
  <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home"></Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      {listItems}
    </Nav>
  </Navbar.Collapse>
</Navbar>
);
}
public loadData(currentContext:any):Promise<LinkItem[]>{

  return new Promise<LinkItem[]>((resolve, reject) => {
   let currentWebUrl = currentContext.pageContext.web.absoluteUrl;
   let requestUrl = currentWebUrl.concat("/_api/web/Lists/GetByTitle('SPFX Menu')/items?$orderby=MenuOrdre");
   currentContext.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
       .then((response: SPHttpClientResponse) => {
           if (response.ok) {
               response.json().then((responseJSON) => {
                   if (responseJSON!=null && responseJSON.value!=null){
                       let items:any[] = responseJSON.value;
                       let listMenuItems:LinkItem[]=[];
                       items.forEach(element => {
                         if(element.MenuType=="Nav.Link"){
                           listMenuItems.push({
                             Key:element.MenuKey,
                             Href:element.MenuHref,
                             Type:element.MenuType,
                             Text:element.Title,
                             Ordre:element.MenuOrdre
                           });
                         }
                         if(element.MenuType=="NavDropdown"){
                           listMenuItems.push({
                             Key:element.MenuKey,
                             Href:element.MenuHref,
                             Type:element.MenuType,
                             Text:element.Title,
                             Ordre:element.MenuOrdre
                           });
                         }
                       });
                       items.forEach(element => {
                         if(element.MenuType=="NavDropdown.Item"){
                           listMenuItems.forEach((e,index) => {
                             if(e.Key==element.MenuKeyParent){
                               if(listMenuItems[index].SubLinks==null)
                               listMenuItems[index].SubLinks=[];
                               listMenuItems[index].SubLinks.push({
                                 Key:element.MenuKey,
                                 Href:element.MenuHref,
                                 Type:element.MenuType,
                                 Text:element.Title,
                                 Ordre:element.MenuOrdre
                               });
                             }
                           });

                         }

                       });
                       resolve(listMenuItems);
                   }
               });
           }
       });
     });
 }

}

