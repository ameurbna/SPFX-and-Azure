export interface LinkItem{

  Key:string,
  Href:string,
  Ordre?:number,
  Text?:string,
  SubLinks?:LinkItem[],
  Type:string //Navbar | Navbar.Brand | Navbar.Toggle | Navbar.Collapse | Nav | Nav.Link | NavDropdown | NavDropdown.Item | NavDropdown.Divider
}
