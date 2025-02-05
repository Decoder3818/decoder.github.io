(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;

  class MainWebComponent extends HTMLElement {
    async getAuthToken(clientId, clientSecret, authUrl) {
      const basicAuth = btoa(`${clientId}:${clientSecret}`);
      
      return new Promise((resolve, reject) => {
        $.ajax({
          url: authUrl + "/oauth/token",
          type: "POST",
          data: "grant_type=client_credentials",
          headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (response) {
            resolve(response.access_token);
          },
          error: function (xhr, status, error) {
            reject(error);
          }
        });
      });
    }

    async makeApiCall(accessToken, apiUrl, query) {
      return new Promise((resolve, reject) => {
        // First make the OPTIONS request
        $.ajax({
          url: apiUrl,
          type: "OPTIONS",
          headers: {
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "ai-resource-group,authorization,content-type",
            "Origin": "https://ey-global-services-12.eu10.hcs.cloud.sap"
          },
          success: function() {
            // After successful OPTIONS, make the actual POST request
            $.ajax({
              url: apiUrl,
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                query: query
              }),
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                "AI-Resource-Group": "default",
                "Accept": "*/*",
                "Origin": "https://ey-global-services-12.eu10.hcs.cloud.sap"
              },
              success: function (response) {
                resolve(response);
              },
              error: function (xhr, status, error) {
                console.error('POST request failed:', {
                  status: xhr.status,
                  error: error,
                  response: xhr.responseText
                });
                reject(error);
              }
            });
          },
          error: function(xhr, status, error) {
            console.error('OPTIONS request failed:', {
              status: xhr.status,
              error: error,
              response: xhr.responseText
            });
            reject(error);
          }
        });
      });
    }

    async post(clientId, clientSecret, authUrl, apiUrl, query) {
      try {
        // Step 1: Get auth token using client credentials
        console.log('Getting auth token...');
        const accessToken = await this.getAuthToken(clientId, clientSecret, authUrl);
        console.log('Got access token');

        // Step 2: Make API call with token
        console.log('Making API call...');
        const response = await this.makeApiCall(accessToken, apiUrl, query);
        console.log('Got API response:', response);
        
        return response;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();
