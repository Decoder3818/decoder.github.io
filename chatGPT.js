var ajaxCall = (Key, Url , Prompt) => {
  return new Promise((resolve, reject) => {
    $.ajax({
  Url,
  type: "POST",
  dataType: "json",
  data: JSON.stringify({
    model: "text-davinci-002",
    prompt: Prompt,
    max_tokens: 1024,
    n: 1,
    temperature: 0.5,
  }),
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Key}`,
  },
    crossDomain: true,
      success: function (response, status, xhr) {
        resolve({ response, status, xhr })
      },
      error: function (response, status, xhr) {
        const err = new Error('xhr error')
        err.status = xhr.status
        reject(err)
      }
})
  })
}

const url = 'https://api.openai.com/v1/';

(function () {
  const template = document.createElement('template')
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class MainWebComponent extends HTMLElement {

    async function post(apiKey,endpoint, prompt) {
  const { response } = await ajaxcall(apiKey, `${url}${endpoint}`, prompt)
    return response;
  };

  }

  customElements.define('custom-widget', MainWebComponent)
})()
