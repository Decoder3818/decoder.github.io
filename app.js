var ajaxCall = (key, url, messages) => {
  return new Promise((resolve, reject) => {
    // Convert each JSON string in the messages array to a JSON object
    const parsedMessages = messages.map(msg => JSON.parse(msg));

    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: parsedMessages,
        max_tokens: 1024,
        n: 1,
        temperature: 0.5,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
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
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, endpoint, messages) {
      // The messages array will contain JSON strings, so we parse them here
      const { response } = await ajaxCall(
        apiKey,
        `${url}/${endpoint}`,
        messages // Keep this as is, since it's supposed to be an array of JSON strings
      );
      console.log(response.choices[0].message.content);
      return response.choices[0].message.content;
    }
  }
  customElements.define("custom-widget", MainWebComponent);
})();
