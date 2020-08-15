declare interface IListCmdSetCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'ListCmdSetCommandSetStrings' {
  const strings: IListCmdSetCommandSetStrings;
  export = strings;
}
