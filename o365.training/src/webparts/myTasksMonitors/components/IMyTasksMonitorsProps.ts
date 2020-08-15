import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMyTasksMonitorsProps {
  description: string;
  context:WebPartContext;
  siteTaskUrl: string;
}
