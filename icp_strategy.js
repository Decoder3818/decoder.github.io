const ajaxCall = (url, query, access_token) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        query: query
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "AI-Resource-Group": "default",
        "Accept": "*/*"
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

const authCall = (clientId, clientSecret, authUrl) => {
  // Properly format the Basic auth token
  const basicAuthToken = btoa(`${clientId}:${clientSecret}`);
  
  return new Promise((resolve, reject) => {
    $.ajax({
      url: authUrl,
      type: "POST",
      data: 'grant_type=client_credentials',
      headers: {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Authorization": `Basic ${basicAuthToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://ey-global-services-12.eu10.hcs.cloud.sap/"
      },
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        console.error('Auth call failed:', {
          status: xhr.status,
          error: error,
          response: xhr.responseText,
          token: basicAuthToken
        });
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;

  class MainWebComponent extends HTMLElement {
    async post(clientId, clientSecret, authUrl, url, query) {
      try {
        console.log('Starting auth process with:', {
          clientId,
          authUrl,
          url
        });

        // Step 1: Get auth token using client credentials
        const { response: authResponse } = await authCall(
          clientId,
          clientSecret,
          authUrl
        );
        
        console.log('Auth response received');
        const access_token = authResponse.access_token;

        // Step 2: Make app call with token
        const { response: appResponse } = await ajaxCall(
          url,
          query,
          access_token
        );
        
        return appResponse;
      } catch (error) {
        console.error('Error in post method:', error);
        throw error;
      }
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();
