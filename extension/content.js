chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getTopWords") {

    const text = document.body.innerText;
    const words = text.split(/\s+/).filter(word => word.length > 3);
    const wordCounts = {};

    words.forEach(word => {
      word = word.toLowerCase();
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    const mostFrequentWords = sortedWords.slice(0, 7);

    sendResponse({ topWords: mostFrequentWords });
    return true
  } 
});