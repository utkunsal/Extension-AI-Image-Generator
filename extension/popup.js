const OPENAI_API_KEY = ""

document.addEventListener("DOMContentLoaded", function() {

  const generateButton = document.getElementById("generate-button");
  const generatedImage = document.getElementById("generated-image"); 
  const additionalPrompts = document.getElementById("additional-prompts"); 
  const errorMessage = document.getElementById("error-message"); 

  generateButton.addEventListener("click", async function() {
      const loadingIndicator = document.getElementById("loading");
      loadingIndicator.style.display = "block"; 
      generatedImage.style.display = "none";

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getTopWords" }, async function(response) {
              if (chrome.runtime.lastError) {
                  console.error("Error handling response:", chrome.runtime.lastError);
                  return;
              }
              
              if (OPENAI_API_KEY === ""){
                errorMessage.textContent = "API key not found in popup.js. Please make sure to provide your API key in the 'OPENAI_API_KEY' field of the popup.js."; 
                loadingIndicator.style.display = "none"; 
              } else {

                const words = response.topWords
                let prompt = words.join(' ');
                const additionalPs = additionalPrompts.value; 
                if (additionalPs !== ""){
                  prompt = additionalPs + " ," + prompt
                }
                try {
                    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${OPENAI_API_KEY}`
                        },
                        body: JSON.stringify({
                            prompt: `digital art, visual elements, ${prompt}`,
                            n: 1,
                            size: '512x512'
                        })
                    });

                    const openaiData = await openaiResponse.json();

                    if (openaiResponse.ok) {
                        const imageUrl = openaiData.data[0].url;
                        generatedImage.src = imageUrl;
                        generatedImage.style.display = "block";
                        errorMessage.textContent = ""; 
                    } else {
                        errorMessage.textContent = 'Error: ' + openaiData.error.message;
                        generatedImage.style.display = "none";
                    }
                  
                } catch (error) {
                    errorMessage.textContent = 'An error occurred: ' + error;
                    generatedImage.style.display = "none";
                } finally {
                    loadingIndicator.style.display = "none"; 
                }
              }
          });
      });
  });
});