(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;

  class MainWebComponent extends HTMLElement {
    async post(clientId, clientSecret, authUrl) {
      const basicAuth = btoa(`${clientId}:${clientSecret}`);
      
      return new Promise((resolve, reject) => {
        $.ajax({
          url: authUrl + "/oauth/token",
          type: "POST",
          data: "grant_type=client_credentials",
          headers: {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          xhrFields: {
            withCredentials: false  // Changed to false since we're sending auth in header
          },
          crossDomain: true,
          success: function (response) {
            console.log('Auth success:', response);
            resolve(response);
          },
          error: function (xhr, status, error) {
            console.error('Auth failed:', {
              status: xhr.status,
              error: error,
              response: xhr.responseText
            });
            reject(error);
          }
        });
      });
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();
