# YouTube Video Analyzer

A Chrome extension for providing on-demand AI-powered analysis of YouTube videos.

**Author:** Abuthwahir H M 

## Project Overview

This project is a Chrome extension that allows users to analyze the YouTube video they are currently watching. It provides key metadata, engagement statistics, and AI-generated insights and summaries. The extension features a simple, modern user interface that appears as a popup when the extension icon is clicked on a YouTube video page.

The primary goal is to offer content creators, marketers, and curious viewers a quick and powerful tool to understand video performance and content without leaving the YouTube page.

### Technology Stack

*   **Frontend:** React `18.x`, Vite
*   **Backend:** Node.js, Express.js
*   **Browser Extension:** Chrome Extension Manifest V3
*   **Key Libraries:**
    *   **Frontend:** `react`, `react-dom`
    *   **Backend (Assumed):** `express`, `cors`, `dotenv`, and a library for AI integration like `openai`.

### Features

*   **One-Click Analysis:** Initiates video analysis from the YouTube video page.
*   **Metadata Extraction:** Fetches video title, channel, duration, view count, and like count.
*   **Engagement Metrics:** Calculates and displays the like-to-view ratio and comment count.
*   **AI-Powered Insights:** Connects to a backend service to generate a concise summary and actionable insights about the video's content.
*   **Tag & Description Viewer:** Displays the video's tags and full description.
*   **Data Export:** Allows users to download the complete analysis as a `.txt` file.
*   **Modern UI:** A clean, responsive interface with loading states and progress indicators.

### UI images 
<img width="1756" height="902" alt="Screenshot 2026-02-12 103357" src="https://github.com/user-attachments/assets/6e741516-fd8f-4cb2-af5f-2cb3471fef76" />
<img width="1773" height="913" alt="Screenshot 2026-02-12 103415" src="https://github.com/user-attachments/assets/f3c4c388-b47d-43bf-997a-fcdc88d60e64" />
<img width="1756" height="920" alt="Screenshot 2026-02-12 103450" src="https://github.com/user-attachments/assets/e01deaa7-fe63-4841-9a06-338df5758daa" />
<img width="439" height="600" alt="image" src="https://github.com/user-attachments/assets/6fd810ea-cb1a-4c4f-adb1-ccb84f801138" />
<img width="1761" height="921" alt="Screenshot 2026-02-12 103536" src="https://github.com/user-attachments/assets/c439f664-51f2-42f4-a4be-7e498367ee4a" />



## How it Works (The Workflow)

The extension operates through a client-server architecture. The frontend is a React application running in the Chrome extension's popup, which communicates with a local Node.js/Express backend to process data and generate insights.

1.  **Loading the Extension:**
    *   The user clicks the extension icon in the Chrome toolbar while on a YouTube video page.
    *   **`public/manifest.json`**: Defines the extension's properties, including the popup file (`index.html`) and necessary permissions (`tabs`, `host_permissions`).
    *   **`index.html` / `src/main.jsx`**: The popup loads `index.html`, which in turn loads the compiled React application. `main.jsx` renders the main `<App />` component into the DOM.

2.  **Initial UI & User Interaction:**
    *   **`src/App.jsx`**: The `App` component renders the initial state: a welcome screen with the title "YouTube Video Analyzer" and a button to start the analysis. The UI is styled by `src/App.css`.
    *   The user clicks the "Analyze Current Video" button.

3.  **Frontend Data Collection:**
    *   **`src/App.jsx` (`analyzeCurrentVideo` function):** The `onClick` handler for the button is triggered.
    *   It uses `chrome.tabs.query({ active: true, currentWindow: true }, ...)` to get the URL of the current active tab.
    *   It validates that the URL is a valid YouTube video page.

4.  **Backend API Call (Analysis):**
    *   **`src/App.jsx` (`analyzeCurrentVideo` function):** A `fetch` POST request is sent to the backend server at `http://localhost:3002/analyze`.
    *   **Request Body:** `{ "url": "https://www.youtube.com/watch?v=..." }`

5.  **Backend Processing (Analysis):**
    *   **`backend/server.js`**: The Express server listens for requests. The `/analyze` route handler receives the video URL.
    *   **Logic (Assumed):** The backend uses a library like `ytdl-core` to scrape metadata (title, description, tags, stats) from the YouTube page.
    *   **Response:** The server sends back a JSON object containing the extracted video data.

6.  **Displaying Results:**
    *   **`src/App.jsx`**: The frontend receives the response and updates its state (`videoData`, `analysisComplete`).
    *   The component re-renders to display the results view, including video details and tabs for "Overview", "Insights", and "Tags". The title changes to "Video Insights Dashboard".

7.  **Generating AI Insights:**
    *   **`src/App.jsx` (`handleTabClick` function):** When the user clicks the "Insights" tab, a new `fetch` POST request is sent to `http://localhost:3002/generate-insights`.
    *   **Request Body:** `{ "title": "...", "description": "...", "statistics": {...} }`
    *   **`backend/server.js`**: The `/generate-insights` route handler receives the data. It then makes a request to an external AI service (e.g., OpenAI API), using an API key stored in `backend/.env`.
    *   **Response:** The AI-generated summary and insights are returned to the frontend.
    *   **`src/App.jsx`**: The `aiInsights` state is updated, and the UI displays the new information.

## Project Structure

```
YouTube_Video_Analyzer/
├── backend/                 # Node.js/Express backend server
│   ├── node_modules/        # Backend dependencies (e.g., express, cors)
│   ├── .env                 # Environment variables (e.g., API keys)
│   ├── package.json         # Defines backend dependencies and scripts
│   └── server.js            # Main Express.js server file, defines API endpoints
├── build/                   # Production build output for the Chrome extension
│   ├── assets/              # Compiled JavaScript and CSS
│   ├── index.html           # The HTML file for the extension's popup
│   └── ...                  # Other static assets (icons, manifest)
├── node_modules/            # Frontend dependencies (e.g., React, Vite)
├── public/                  # Static assets that are copied to the build directory
│   ├── logo16.png           # 16x16 extension icon
│   ├── logo48.png           # 48x48 extension icon
│   ├── logo128.png          # 128x128 extension icon
│   ├── manifest.json        # Chrome extension manifest file
│   └── vite.svg             # Vite logo (default asset)
├── src/                     # Frontend React source code
│   ├── assets/              # Static assets used by the React app
│   │   └── logo.png         # Application logo displayed in the UI
│   ├── App.css              # Styles for the main App component
│   ├── App.jsx              # The main React component containing all UI and logic
│   ├── index.css            # Global CSS styles
│   └── main.jsx             # The entry point for the React application
├── .gitignore               # Specifies files for Git to ignore
├── eslint.config.js         # Configuration for ESLint code linter
├── index.html               # Root HTML file for local development server
├── package.json             # Frontend project configuration and dependencies
├── PROJECT_EXPLANATION.md   # This documentation file
└── vite.config.js           # Configuration file for the Vite build tool
```

## API Endpoints (Backend)

The backend server exposes the following endpoints:

### Analyze Video

*   **URL:** `/analyze`
*   **Method:** `POST`
*   **Description:** Receives a YouTube video URL and returns its scraped metadata.
*   **Request Body:**
    ```json
    {
      "url": "https://www.youtube.com/watch?v=VIDEO_ID"
    }
    ```
*   **Success Response (200):**
    ```json
    {
      "title": "Video Title",
      "channel": "Channel Name",
      "views": "1,234,567",
      "likes": "56,789",
      "uploadDate": "Oct 19, 2025",
      "duration": "10:32",
      "thumbnail": "https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg",
      "description": "Video description text...",
      "tags": ["tag1", "tag2", "tag3"],
      "engagement": {
        "commentCount": "1,234",
        "likeRatio": "98.5",
        "subscriberGrowth": "N/A"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: If the URL is invalid or not a YouTube video link.
    *   `500 Internal Server Error`: If the backend fails to scrape the data.
*   **cURL Example:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}' \
    http://localhost:3002/analyze
    ```

### Generate Insights

*   **URL:** `/generate-insights`
*   **Method:** `POST`
*   **Description:** Receives video metadata and generates an AI summary and insights.
*   **Request Body:**
    ```json
    {
      "title": "Video Title",
      "description": "Video description text...",
      "statistics": {
        "views": "1,234,567",
        "likes": "56,789"
      }
    }
    ```
*   **Success Response (200):**
    ```json
    {
      "summary": "This video is about...",
      "insights": [
        "Insight 1...",
        "Insight 2..."
      ]
    }
    ```
*   **Error Response:**
    *   `500 Internal Server Error`: If the AI service fails or the request times out.
*   **cURL Example:**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
    -d '{"title":"Example Title","description":"Example description.","statistics":{"views":"1000","likes":"100"}}' \
    http://localhost:3002/generate-insights
    ```

## How to Run the Project

To run this project, you need to have two things running at the same time: the backend server and the frontend development server.

1.  **Install Dependencies:**
    *   Run `npm install` in the root directory (`YouTube_Video_Analyzer/`).
    *   Navigate to the backend directory (`cd backend`) and run `npm install`.

2.  **Set Up Environment Variables:**
    *   In the `backend` directory, create a file named `.env`.
    *   Add the following line, replacing `YOUR_API_KEY` with your actual key for the AI service.
        ```
        # .env file
        PORT=3002
        OPENAI_API_KEY=YOUR_API_KEY_HERE
        ```

3.  **Start the Backend Server:**
    *   In your terminal, from the `backend` directory, run the command:
        ```bash
        npm start
        ```
    *   You should see the message: `Backend server listening at http://localhost:3002`.

4.  **Start the Frontend Development Server:**
    *   In a new terminal, from the project's root directory (`YouTube_Video_Analyzer/`), run the command:
        ```bash
        npm run dev
        ```
    *   This starts the Vite development server for the React UI.

5.  **Load the Extension in Chrome:**
    *   Open Google Chrome and navigate to `chrome://extensions`.
    *   Enable the **Developer mode** toggle in the top-right corner.
    *   Click the **"Load unpacked"** button.
    *   Select the `YouTube_Video_Analyzer/build` directory in the file dialog.
    *   The extension will appear in your list. Pin it to your toolbar for easy access.
    *   **Note:** You must run `npm run build` in the root directory at least once to create the `build` folder before loading the extension.

## Development Workflow & Common Tasks

*   **Adding a New Feature:**
    1.  **UI:** Modify components in `src/` (likely `App.jsx`) to add new UI elements.
    2.  **Backend:** If new data is needed, add a new route in `backend/server.js` and implement the corresponding logic.
    3.  **Styling:** Add or update styles in `src/App.css`.
    4.  **Rebuild:** Run `npm run build` in the root directory to update the extension files in the `build/` folder.
    5.  **Reload:** Go to `chrome://extensions` and click the "Reload" button for the extension.

*   **Debugging:**
    *   **Popup UI:** Right-click the extension icon and select "Inspect popup". This opens Chrome DevTools for the popup's context.
    *   **Backend:** View the console output in the terminal where you ran `npm start` for the backend. Use `console.log()` statements in `server.js` for debugging.

*   **Testing:**
    *   No test framework is currently configured. To add testing:
    *   Install Jest and React Testing Library: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom`
    *   Configure Jest (e.g., `jest.config.js`).
    *   Add a test script to `package.json`: `"test": "jest"`
    *   Create test files like `App.test.js` to write unit and integration tests.

*   **Building for Production:**
    *   Run `npm run build` in the root directory. This will create an optimized, production-ready build of the frontend in the `build/` directory. This directory is what you would zip and upload to the Chrome Web Store.

*   **Deploying the Backend:**
    *   The backend can be deployed to any Node.js hosting service (e.g., Heroku, Vercel, AWS).
    *   Ensure you set the `PORT` and `OPENAI_API_KEY` environment variables in the hosting provider's settings dashboard.

## Security & Privacy Notes

*   **Permissions:**
    *   `"tabs"`: Required to get the URL of the current active tab to send to the backend for analysis.
    *   `"host_permissions"`: `["http://localhost:3002/*"]` is required for the extension to communicate with the local backend server. For a production deployment, this would be changed to the URL of the deployed backend.
*   **API Keys:** The `OPENAI_API_KEY` is sensitive. It is correctly stored in a `.env` file on the backend and should **never** be exposed in the frontend (client-side) code. The `.gitignore` file should include `.env` to prevent it from being committed to version control.

## Troubleshooting

*   **Extension popup is blank:**
    *   Ensure the frontend dev server is running (`npm run dev`).
    *   Ensure you have run `npm run build` at least once.
    *   Reload the extension from `chrome://extensions`.
*   **"Analyze" button does nothing or shows an error:**
    *   Check that the backend server is running (`npm start` in the `backend` directory).
    *   Open the popup's developer console (right-click icon -> inspect) and check for network errors (e.g., CORS, 404 Not Found).
    *   Ensure `cors` is enabled on the Express server in `backend/server.js`.
*   **Changes to code are not reflected:**
    *   After changing frontend code, you must run `npm run build` again.
    *   After building, you must reload the extension in `chrome://extensions`.

## FAQ

*   **Q: Why do I need to run a separate backend server?**
    *   A: The backend server handles the processing-intensive task of scraping video data and securely manages the API key for the AI service. This prevents exposing sensitive keys in the client-side code.
*   **Q: Can I use this on other video sites like Vimeo?**
    *   A: No, this tool is currently built specifically for YouTube video pages (`youtube.com/watch`).
*   **Q: The analysis is failing with an error.**
    *   A: Ensure both the frontend and backend servers are running correctly. Check the console in both the extension popup and the backend terminal for specific error messages.

## TODOs & Known Limitations

*   **[TODO]** The backend logic for `/generate-insights` needs to be implemented with a real AI service API call. The `OPENAI_API_KEY` in `.env` is a placeholder.
*   **[TODO]** Add more robust error handling for network failures and invalid YouTube URLs.
*   **[TODO]** The backend routes are all in `server.js`. For a larger application, they should be refactored into separate route and controller files.
*   **[Assumption]** The project uses `npm` as the package manager.
*   **[Assumption]** The backend uses `ytdl-core` or a similar library for scraping. The actual implementation may vary.

## Appendix

### Useful Commands

*   **Install all dependencies:**
    ```bash
    # In root directory
    npm install
    # In backend directory
    cd backend && npm install
    ```
*   **Run development servers:**
    ```bash
    # Terminal 1 (root directory)
    npm run dev

    # Terminal 2 (backend directory)
    npm start
    ```
*   **Build for production:**
    ```bash
    # In root directory
    npm run build
    ```

### Example `.env` file

Create this file in the `/backend` directory:

```
# Port for the backend server
PORT=3002

# API Key for OpenAI or other AI service
OPENAI_API_KEY="your-secret-api-key-here"
```

### Further Reading

*   [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/manifest/)
*   [React Docs](https://reactjs.org/)
*   [Express.js Docs](https://expressjs.com/)

### Some Questions

1. What was the biggest takeaway or result from your analysis?
The biggest takeaway is the successful integration of a browser extension frontend with a separate backend service to perform complex tasks. The key result is a functional prototype that demonstrates a full-stack workflow: the extension extracts a URL from the active browser tab, sends it to a Node.js server for data scraping and AI-powered analysis, and then displays the enriched data back to the user in a clean, reactive UI. This proves the viability of the core architecture.

2. Has the system been tested with real users, or is it in the prototype stage?
The system is currently in the prototype stage. The setup is configured for a local development environment, and key features, such as the AI insights generation, rely on placeholder logic. It has not yet been deployed or tested with a wider user base.

3. Should I highlight any particular challenge you overcame?
Yes, a significant challenge was managing the cross-origin communication between the Chrome extension and the local backend server. This required a specific configuration to handle:

Chrome Extension Permissions: The manifest.json file had to be carefully configured with the correct "host_permissions" to allow the extension's frontend (running in the browser) to make fetch requests to the backend server (http://localhost:3002).
CORS on the Backend: The Express server needed to be configured with CORS (Cross-Origin Resource Sharing) middleware to accept and respond to requests originating from the extension's chrome-extension:// protocol.
