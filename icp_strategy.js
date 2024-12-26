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
          url: authUrl,
          type: "POST",
          data: "grant_type=client_credentials",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`,
            "Host": "psibuild.authentication.eu10.hana.ondemand.com",
            "Accept": "*/*"
          },
          beforeSend: function(xhr) {
            console.log('Request headers:', {
              contentType: xhr.getRequestHeader('Content-Type'),
              authorization: xhr.getRequestHeader('Authorization'),
              host: xhr.getRequestHeader('Host')
            });
          },
          success: function (response) {
            console.log('Auth success:', response);
            resolve(response);
          },
          error: function (xhr, status, error) {
            console.error('Auth failed:', {
              status: xhr.status,
              error: error,
              response: xhr.responseText,
              headers: xhr.getAllResponseHeaders()
            });
            reject(error);
          }
        });
      });
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();
