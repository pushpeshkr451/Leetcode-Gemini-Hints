# LeetCode Gemini Hints

Stuck on a LeetCode problem? LeetCode Gemini Hints is a simple, powerful Chrome extension that provides you with on-demand, conceptual hints directly from Google's Gemini AI. It acts as your personal coding coach, guiding you toward the solution without giving it away.

 ## Features

* **On-Demand Hints**: A clean, floating hint button (`💡`) appears on every LeetCode problem page.
* **Context-Aware**: The extension reads the problem title and description to provide relevant hints.
* **Progressive Guidance**: Each new hint takes into account the previous hints you've received, ensuring a logical progression.
* **Focus on Concepts**: The AI is specifically prompted to provide conceptual clues, suggest algorithms or data structures, and highlight key observations—never direct code or full solutions.
* **Secure API Key Storage**: Your Gemini API key is stored safely and locally in your browser's storage and is only used to communicate with the Google API.

## Complete Setup Guide

Follow these steps carefully to get the extension up and running in your browser.

### Step 1: Download the Extension Files

1.  Go to the main page of this GitHub repository.
2.  Click the green `<> Code` button.
3.  Select **Download ZIP** from the dropdown menu.


### Step 2: Unpack the ZIP File

1.  Locate the downloaded `.zip` file on your computer.
2.  Unzip or extract its contents into a permanent folder that you won't delete. For example, you could create a folder named `chrome-extensions` in your Documents.

> **Important**: You must extract the files. The extension cannot be loaded directly from the `.zip` file.

### Step 3: Load the Extension in Chrome

1.  Open your Google Chrome browser.
2.  Navigate to the extensions page by typing `chrome://extensions` in your address bar and pressing Enter.
3.  In the top-right corner of the extensions page, toggle on **Developer mode**.
4.  Three new buttons will appear. Click on **Load unpacked**.
5.  A file selection dialog will open. Navigate to and select the folder where you extracted the extension files (the folder that contains `manifest.json`, `content.js`, etc.).

The "LeetCode Gemini Hints" extension should now appear in your list of installed extensions.

### Step 4: Get Your Gemini API Key

This extension requires a personal API key to communicate with the Gemini AI.

1.  Go to the **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  You may need to sign in with your Google account.
3.  Click the **Create API key** button.
4.  Your new API key will be generated. Click the copy icon to copy it to your clipboard. Keep this key safe.

### Step 5: Final Configuration

1.  Navigate to any LeetCode problem page, for example: `https://leetcode.com/problems/two-sum/`.
2.  You will see a new floating "💡" button in the bottom-right corner.
3.  Click the button for the first time.
4.  A browser prompt will appear asking for your API key. Paste the key you copied from Google AI Studio into the text box and click OK.

That's it! The extension is now fully configured. This is a one-time setup; the extension will securely remember your key for all future requests.

---

### How to Change or Re-initialize Your API Key

If your API key stops working (e.g., it was deleted or you have exceeded your quota), you will see an error message in the hints modal. Because an (invalid) key is still saved, you won't be automatically prompted for a new one.

To fix this, you must manually delete the old key to re-trigger the setup prompt.

1.  Navigate back to the extensions page at `chrome://extensions`.
2.  Find the **LeetCode Gemini Hints** card and click the **Details** button.
3.  Click the link that says **Service worker**. This will open Chrome's DevTools for the extension.
4.  In the DevTools window, go to the **Application** tab.
5.  In the left-hand menu under the "Storage" section, expand **Local Storage**.
6.  Click on the item below it, which will look like `chrome-extension://[some-long-id]`.
7.  In the main panel, you will see a `geminiApiKey` entry. Right-click on this row and select **Delete**.
8.  Close the DevTools window.
9.  Go back to any LeetCode problem page and click the "💡" hint button again. You will now be prompted to enter your new API key, just like in the initial setup.

---

## How to Use

1.  Navigate to any LeetCode problem page.
2.  When you're feeling stuck, click the floating "💡" button.
3.  The modal window will appear, and Gemini will generate your first hint.
4.  If you need more help, click the button again to receive another, more advanced hint that builds upon the previous ones.

## How It Works (Functions)

The extension is built with several components that work together:

* **`manifest.json`**: This is the core configuration file for the extension. It defines the extension's name, permissions (like `storage` for the API key and `scripting` to run on LeetCode pages), and points to the other files.
* **`content.js`**: This script is injected directly into LeetCode problem pages. Its responsibilities are:-
    * Creating the floating hint button (`💡`) and the modal window.
    * Scraping the problem's title and description from the page when the button is clicked.
    * Sending this information to the `service-worker` to request a hint.
    * Displaying the returned hints in the modal.
    * Prompting the user for their API key if it's not already stored.
* **`service-worker.js`**: This is the background brain of the extension. It:
    * Listens for messages from the `content.js` script.
    * Retrieves the saved Gemini API key from `chrome.storage.local`.
    * Constructs a detailed prompt for the Gemini AI (`gemini-1.5-flash-preview-05-20` model). The prompt instructs the AI to act as a LeetCode coach, analyze the problem, and provide a conceptual hint without revealing the code or solution.
    * Makes the API call to the Google Generative Language API endpoint.
    * Sends the resulting hint (or any error) back to `content.js` to be displayed.
* **`style.css`**: This file provides all the visual styling for the floating button and the hints modal to ensure it looks clean and readable.

## Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to fork the repository and submit a pull request. 
