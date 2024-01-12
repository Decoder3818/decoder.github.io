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
                "name": "get_IC_price",
                "description": "Get the required information from user such as Material Number, Transfer Pricing Strategy and Company Code Country to determine Intercompany(IC) price",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "Material Number": {"type": "string", "description": "Material number of the product"},
                        
                        "Transfer Princing Strategy": {"type": "string", "description": "The applicable transfer pricing strategy"},
                        
                        "Company Code Country": {"type": "string", "description": "Location for which user is searching"}
                    },
                    "required": ["Material Number","Transfer Pricing Strategy","Company Code Country"]
                }
            }
        }
    ],
        max_tokens: 100,
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
    // Check if 'content' is null and retrieve arguments from 'tool_calls' if available
    if (response.choices[0].message.content == null) {
      const toolCalls = response.choices[0].message.tool_calls;
      if (toolCalls && toolCalls.length > 0) {
        const toolCallArguments = toolCalls[0].function.arguments;
        // Assuming you want to use the arguments as a JSON string
        console.log(toolCallArguments);
        return toolCallArguments;
      } else {
        throw new Error("No content or tool calls available in response");
      }
    } else {
      console.log(response.choices[0].message.content);
      return response.choices[0].message.content;
    }
  }
}
  customElements.define("custom-widget", MainWebComponent);
})();
