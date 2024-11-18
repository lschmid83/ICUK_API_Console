﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace API.Core {

    /// <summary>
    /// Handles page action for API console requests.
    /// </summary>
    public class ConsoleRequest {

        private string pageAction = "";
        private string pageContent = "";

        /// <summary>
        /// Application.
        /// </summary>
        public HttpApplicationState Application = HttpContext.Current.Application;
        /// <summary>
        /// HttpRequest.
        /// </summary>
        public HttpRequest Request = HttpContext.Current.Request;
        
        /// <summary>
        /// The requested action for the page, from the action form or query string variables.
        /// </summary>
        public string PageAction {
            get { return pageAction; }
        }

        /// <summary>
        /// The final content generated by a page.
        /// </summary>
        public string PageContent {
            get { return pageContent; }
            set { pageContent = value; }
        }
             
        /// <summary>
        /// Constructor.
        /// </summary>
		public ConsoleRequest() {

            // Retrieve the page action.
            RetrievePageAction();

		}

        /// <summary>
        /// Sets the pageAction member to the action query string parameter.
        /// </summary>
        private void RetrievePageAction() {
            if (Request.QueryString["action"] == null && Request.Form["action"] == null)
                return;

            // Use the query string variable before the form.
            if (Request.QueryString["action"] != null && Regex.IsMatch(Request.QueryString["action"], "^[a-zA-Z0-9_]+$")) {
                pageAction = Convert.ToString(Request.QueryString["action"]);
            }
            else if (Request.Form["action"] != null && Regex.IsMatch(Request.Form["action"], "^[a-zA-Z0-9_]+$")) {
                pageAction = Convert.ToString(Request.Form["action"]);
            }
        }

        /// <summary>
        /// Executes the called action within the page if it exists.
        /// Defaults to null (i.e. Main) otherwise.
        /// </summary>
        /// <param name="actions">
        /// Dictionary of action names and corresponding methods, via delegates.
        /// </param>
        protected void ExecuteAction(Dictionary<string, Action> actions) {
            
            try {
                if (PageAction != null && actions.ContainsKey(PageAction)) {
                    actions[PageAction]();
                }
                else {
                    actions[""]();
                }
            }
            catch (Exception) {
              
            }
        }
    }
}
