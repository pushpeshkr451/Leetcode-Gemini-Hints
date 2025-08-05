// --- Message Listener ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_HINT") {
    const { title, description, previousHints } = request.payload;

    (async () => {
      try {
        const hint = await getHintFromGemini(title, description, previousHints);
        sendResponse({ hint });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    })();

    return true; // Indicates that the response is sent asynchronously
  }

  if (request.type === "SET_API_KEY") {
    chrome.storage.local.set({ geminiApiKey: request.payload.apiKey }, () => {
      console.log("LeetCode Hints: API Key has been saved.");
      sendResponse({ success: true });
    });
    return true;
  }
});

// --- Gemini API Logic ---
async function getHintFromGemini(title, description, previousHints) {
  const data = await chrome.storage.local.get("geminiApiKey");
  const apiKey = data.geminiApiKey;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const prompt = `
      You are an expert LeetCode coach. Your goal is to help users solve problems by providing conceptual hints, not direct solutions or code.
      The user is working on the following LeetCode problem:
      Problem Title: "${title}"
      Problem Description:
      ${description.replace(/<[^>]*>/g, "")}
      The user has already received the following hints:
      ${
        previousHints.map((h, i) => `- Hint ${i + 1}: ${h}`).join("\n") ||
        "None"
      }
      Based on the problem and the previous hints, provide a new, unique, and concise hint (1-2 sentences).
      Focus on one of the following:
      - A key observation the user might be missing.
      - The name of a relevant algorithm or data structure.
      - A way to simplify the problem or handle an edge case.
      **Do not write any code. Do not give away the full solution.** Just provide the next logical hint.
  `;

  // This version has NO extra generationConfig or safetySettings
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage =
        result?.error?.message || `HTTP Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
      return result.candidates[0].content.parts[0].text.trim();
    } else {
      throw new Error(
        "The AI did not return a hint. This might be due to safety settings or the problem's content. Please try again."
      );
    }
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw error;
  }
}
