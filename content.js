let hints = []; // Store hints for the current session

// --- UI Creation Functions ---

function createModal() {
  const overlay = document.createElement("div");
  overlay.className = "gemini-modal-overlay";
  overlay.style.display = "none";
  const modalContent = document.createElement("div");
  modalContent.className = "gemini-modal-content";
  const closeButton = document.createElement("button");
  closeButton.className = "gemini-modal-close-btn";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = () => (overlay.style.display = "none");
  const title = document.createElement("div");
  title.className = "gemini-modal-title";
  title.textContent = "Hints from Gemini";
  const hintsContainer = document.createElement("div");
  hintsContainer.id = "gemini-hints-container";
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(hintsContainer);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
}

function showModal() {
  const overlay = document.querySelector(".gemini-modal-overlay");
  if (overlay) {
    overlay.style.display = "flex";
  }
}

function updateModalContent(isLoading) {
  const hintsContainer = document.getElementById("gemini-hints-container");
  if (!hintsContainer) return;

  hintsContainer.innerHTML = "";

  if (isLoading) {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "gemini-loading-indicator";
    loadingIndicator.textContent = "Gemini is thinking...";
    hintsContainer.appendChild(loadingIndicator);
  }

  // Display existing hints
  hints.forEach((hint, index) => {
    const hintElement = document.createElement("div");
    hintElement.className = "gemini-hint";
    hintElement.innerHTML = `<strong>Hint #${index + 1}:</strong> ${hint}`;
    hintsContainer.appendChild(hintElement);
  });
}

// --- Main Logic ---

async function handleHintRequest(button) {
  showModal();
  updateModalContent(true);
  button.disabled = true;

  const titleElement = document.querySelector(
    '.text-title-large a, .mr-2.text-label-1 a, div[data-cy="question-title"]'
  );
  const descriptionElement = document.querySelector(
    'div[data-track-load="description_content"]'
  );
  const title = titleElement ? titleElement.innerText : "Unknown Problem";
  const description = descriptionElement
    ? descriptionElement.innerHTML
    : "Could not find problem description.";

  try {
    const response = await chrome.runtime.sendMessage({
      type: "GET_HINT",
      payload: { title, description, previousHints: hints },
    });

    if (response.error) {
      // Check for our specific missing key error
      if (response.error === "API_KEY_MISSING") {
        const apiKey = prompt(
          "Please enter your Gemini API Key.\nYou can get one from Google AI Studio.\nThis will be saved locally and only asked for once."
        );
        if (apiKey) {
          // Save the key and retry the hint request
          await chrome.runtime.sendMessage({
            type: "SET_API_KEY",
            payload: { apiKey },
          });
          handleHintRequest(button); // Retry
          return; // Exit the current function call
        } else {
          // User cancelled the prompt
          updateModalContent(false);
        }
      } else {
        // Handle other errors from the API
        alert(`API Error: ${response.error}`);
        updateModalContent(false);
      }
    } else if (response.hint) {
      hints.push(response.hint);
      updateModalContent(false);
    }
  } catch (error) {
    console.error("Error getting hint:", error);
    alert(`A technical error occurred: ${error.message}`);
    updateModalContent(false);
  } finally {
    button.disabled = false;
  }
}

// --- Main Execution ---

function initializeExtension() {
  if (document.getElementById("gemini-floating-hint-button")) return;

  console.log("LeetCode Hints: Initializing floating button.");

  const hintButton = document.createElement("button");
  hintButton.id = "gemini-floating-hint-button";
  hintButton.innerHTML = "💡";
  hintButton.title = "Get a hint from Gemini";

  hintButton.addEventListener("click", () => handleHintRequest(hintButton));

  document.body.appendChild(hintButton);
  createModal();

  console.log("LeetCode Hints: Floating button and modal are ready.");
}

initializeExtension();
