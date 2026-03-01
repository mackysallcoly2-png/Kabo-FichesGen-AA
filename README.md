<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/12RkX_7OMgcEOmrNkTOGYyN8O2v_vyBHg

## Run Locally

**Prerequisites:**  Node.js (v18 or v20 recommended)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create an `.env.local` file in the project root and add your Gemini API key:
   ```env
   API_KEY=your_google_genai_api_key_here
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Build for Production

To generate an optimized production bundle, run:
```bash
npm run build
```
The output will appear in the `dist/` directory.

## Packaging as Windows Executable

A simple Node/Express wrapper (`server.js`) serves the built files and can be compiled
into a standalone `.exe` using [pkg](https://github.com/vercel/pkg).

1. Make sure `express` is installed (`npm install express`).
2. Run the packaging script:
   ```bash
   npm run package
   ```
3. After completion you will find `KaboFichesGen.exe` in the project root. This executable
   can be distributed and run on Windows without requiring Node.js or any other dependencies.

## Improvements & Notes

- Added error handling around local storage JSON parsing in `App.tsx` to avoid crashes when stored data is malformed.
- Improved packaging configuration (`pkg` target `node18-win-x64`, assets inclusion).
- Added basic server script (`server.js`) to serve static build output.
- Some UI tweaks and script improvements to streamline generation and export features.

Feel free to open issues or contribute enhancements!
