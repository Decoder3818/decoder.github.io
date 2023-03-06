var ajaxPromisify = (url, type, data, headers) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type,
      data,
      contentType: 'application/json',
      headers: {
                "Host": "23c126a7-beb6-43cc-86bf-42e00558034c.mock.pstmn.io",
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Connection": "keep-alive",
                "Accept": "*/*"
                     },
      // xhrFields: {
      //   withCredentials: true
      // },
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

const SERVICE_END_POINT = 'https://23c126a7-beb6-43cc-86bf-42e00558034c.mock.pstmn.io';

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

    async post (path, jsonString) {
      const { response } = await ajaxPromisify(`${SERVICE_END_POINT}${path}`, 'POST', jsonString)
      return response
    }
  }

  customElements.define('custom-widget', MainWebComponent)
})()
