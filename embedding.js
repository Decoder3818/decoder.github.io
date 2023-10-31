var ajaxPromisify = (apiKey, url, query) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify({
    "input": query,
    "model": "text-embedding-ada-002"
  }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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

const url = "https://api.openai.com/v1";
(function () {
  const template = document.createElement('template')
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class MainWebComponent extends HTMLElement {
    // ------------------
    // Scripting methods
    // ------------------

    async post (apiKey,endpoint, query) {
      const { response } = await ajaxPromisify(apiKey, `${url}${endpoint}`, query)
      return response.data[0].embedding
    }
  }

  customElements.define('custom-widget', MainWebComponent)
})()
