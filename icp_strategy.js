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
  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  
  return new Promise((resolve, reject) => {
    $.ajax({
      url: authUrl,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        grant_type: "client_credentials"
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
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
      // Step 1: Get auth token using client credentials
      const { response: authResponse } = await authCall(
        clientId,
        clientSecret,
        authUrl
      );
      const access_token = authResponse.access_token;

      // Step 2: Make app call with token
      const { response: appResponse } = await ajaxCall(
        url,
        query,
        access_token
      );
      
      console.log(appResponse);
      return appResponse;
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();
