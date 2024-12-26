const ajaxCall = (url, query, access_token) => {
  return new Promise((resolve, reject) => {
    console.log('Making API call with token:', access_token);
    
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
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        console.log('API call successful:', response);
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        console.error('API call failed:', {
          status: xhr.status,
          error: error,
          response: xhr.responseText
        });
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

const authCall = (clientId, clientSecret, authUrl) => {
  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  console.log('Making auth call with Basic auth token:', basicAuth);
  
  return new Promise((resolve, reject) => {
    $.ajax({
      url: authUrl,
      type: "POST",
      data: 'grant_type=client_credentials',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        console.log('Auth call successful:', response);
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        console.error('Auth call failed:', {
          status: xhr.status,
          error: error,
          response: xhr.responseText
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
        // Step 1: Get auth token using client credentials
        const { response: authResponse } = await authCall(
          clientId,
          clientSecret,
          authUrl
        );
        console.log('Auth token received:', authResponse);
        const access_token = authResponse.access_token;

        // Step 2: Make app call with token
        const { response: appResponse } = await ajaxCall(
          url,
          query,
          access_token
        );
        
        console.log('Final response:', appResponse);
        return appResponse;
      } catch (error) {
        console.error('Error in post method:', error);
        throw error;
      }
    }
  }

  customElements.define("custom-widget", MainWebComponent);
})();
