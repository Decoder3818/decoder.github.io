var ajaxCall = (key, url, messages) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: messages,
         "tools" : [
        {
            "type": "function",
            "function": {
                "name": "get_IC_Prices",
                "description": "Get the required values from user query such as Material Number, Transfer Pricing Strategy and Jurisdiction to determine Intercompany Prices(IC).",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "Material Number": {"type": "string", "description": "Material number of the product"},
                        
                        "Transfer Princing Strategy": {"type": "string", "description": "The applicable transfer pricing strategy"},
                        
                        "Jurisdiction": {"type": "string", "description": "Location for which user is searching"}
                    },
                    "required": ["Material Number", "Transfer Pricing Strategy", "Jurisdiction"]
                }
            }
        }
    ],
        max_tokens: 1024,
        n: 1,
        temperature: 0.9,
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
