using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Security;
using System.ServiceModel;
using System.Text;
using System.Web.Configuration;

namespace SampleRemoteEventReceiverWeb.Services
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "DemoRemoteEventReceiver" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select DemoRemoteEventReceiver.svc or DemoRemoteEventReceiver.svc.cs at the Solution Explorer and start debugging.
    public class DemoRemoteEventReceiver : IRemoteEventService
    {
        /// <summary>
        /// Handles events that occur before an action occurs, such as when a user adds or deletes a list item.
        /// </summary>
        /// <param name="properties">Holds information about the remote event.</param>
        /// <returns>Holds information returned from the remote event.</returns>
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult result = new SPRemoteEventResult();

            using (ClientContext clientContext = TokenHelper.CreateRemoteEventReceiverClientContext(properties))
            {
                if (clientContext != null)
                {
                    clientContext.Load(clientContext.Web);
                    clientContext.ExecuteQuery();
                }
            }

            return result;
        }

        /// <summary>
        /// Handles events that occur after an action occurs, such as after a user adds an item to a list or deletes an item from a list.
        /// </summary>
        /// <param name="properties">Holds information about the remote event.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            // On Item Added event, the list item creation executes
            if (properties.EventType == SPRemoteEventType.ItemAdded)
            {
                using (ClientContext clientContext = new ClientContext(properties.ItemEventProperties.WebUrl))
                {
                    var login = WebConfigurationManager.AppSettings.Get("LoginAdmin");
                    string pwd = WebConfigurationManager.AppSettings.Get("PasswordAdmin");
                    SecureString password = new SecureString();
                    foreach (char c in (pwd).ToCharArray()) password.AppendChar(c);
                    clientContext.Credentials = new SharePointOnlineCredentials(login, password);

                    if (clientContext != null)
                    {
                        try
                        {
                            string title = properties.ItemEventProperties.AfterProperties["Title"].ToString();

                            List lstDemoeventReceiver = clientContext.Web.Lists.GetByTitle(properties.ItemEventProperties.ListTitle);
                            ListItem itemDemoventReceiver = lstDemoeventReceiver.GetItemById(properties.ItemEventProperties.ListItemId);

                            itemDemoventReceiver["Description"] = "Description from RER : " + title;
                            itemDemoventReceiver.Update();
                            clientContext.ExecuteQuery();
                        }
                        catch (Exception ex) { }
                    }
                }
            }
        }
    }
}
