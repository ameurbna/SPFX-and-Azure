using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security;
using System.Text;
using System.Web.Configuration;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;

namespace SampleRemoteEventReceiverWeb.Services
{
    public class AppEventReceiver : IRemoteEventService
    {
        /// <summary>
        /// Handles app events that occur after the app is installed or upgraded, or when app is being uninstalled.
        /// </summary>
        /// <param name="properties">Holds information about the app event.</param>
        /// <returns>Holds information returned from the app event.</returns>
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult result = new SPRemoteEventResult();
            if (properties.EventType == SPRemoteEventType.AppInstalled)
            {
                using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, false))
                //using (ClientContext clientContext = new ClientContext(properties.AppEventProperties.HostWebFullUrl.AbsoluteUri))
                {
                    //var login = WebConfigurationManager.AppSettings.Get("LoginAdmin");
                    //string pwd = WebConfigurationManager.AppSettings.Get("PasswordAdmin");
                    //SecureString password = new SecureString();
                    //foreach (char c in (pwd).ToCharArray()) password.AppendChar(c);
                    //clientContext.Credentials = new SharePointOnlineCredentials(login, password);

                    if (clientContext != null)
                    {
                        //Get reference to the host web list with name Feedback
                        var documentsList = clientContext.Web.Lists.GetByTitle("Pays");
                        clientContext.Load(documentsList);
                        clientContext.ExecuteQuery();
                        string remoteUrl = "https://sampleremoteeventreceiverweb20200505051829.azurewebsites.net/Services/DemoRemoteEventReceiver.svc";
                        //string remoteUrl = "https://b45b900d.ngrok.io/Services/DemoRemoteEventReceiver.svc";
                        //Create the remote event receiver definition
                        EventReceiverDefinitionCreationInformation newEventReceiver = new EventReceiverDefinitionCreationInformation()
                        {
                            EventType = EventReceiverType.ItemAdded,
                            ReceiverAssembly = Assembly.GetExecutingAssembly().FullName,
                            ReceiverName = "DemoRemoteEventReceiver",
                            ReceiverClass = "DemoRemoteEventReceiver",
                            ReceiverUrl = remoteUrl,
                            SequenceNumber = 15001
                        };
                        //Add the remote event receiver to the host web list
                        documentsList.EventReceivers.Add(newEventReceiver);
                        clientContext.ExecuteQuery();
                    }
                }
            }
            else if (properties.EventType == SPRemoteEventType.AppUninstalling)
            {
                using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, false))
                //using (ClientContext clientContext = new ClientContext(properties.AppEventProperties.HostWebFullUrl.AbsoluteUri))
                {
                    //var login = WebConfigurationManager.AppSettings.Get("LoginAdmin");
                    //string pwd = WebConfigurationManager.AppSettings.Get("PasswordAdmin");
                    //SecureString password = new SecureString();
                    //foreach (char c in (pwd).ToCharArray()) password.AppendChar(c);
                    //clientContext.Credentials = new SharePointOnlineCredentials(login, password);

                    var list = clientContext.Web.Lists.GetByTitle("Pays");
                    clientContext.Load(list);
                    clientContext.ExecuteQuery();
                    EventReceiverDefinitionCollection erdc = list.EventReceivers;
                    clientContext.Load(erdc);
                    clientContext.ExecuteQuery();
                    List<EventReceiverDefinition> toDelete = new List<EventReceiverDefinition>();
                    foreach (EventReceiverDefinition erd in erdc)
                    {
                        if (erd.ReceiverName == "DemoRemoteEventReceiver")
                        {
                            toDelete.Add(erd);
                        }
                    }
                    //Delete the remote event receiver from the list, when the app gets uninstalled
                    foreach (EventReceiverDefinition item in toDelete)
                    {
                        item.DeleteObject();
                        clientContext.ExecuteQuery();
                    }
                }
            }
            return result;
        }

        /// <summary>
        /// This method is a required placeholder, but is not used by app events.
        /// </summary>
        /// <param name="properties">Unused.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            throw new NotImplementedException();
        }

    }
}
