<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![gh-pages-shield]][gh-pages-url]
[![website-shield]][website-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/stxgao/stxgao.github.io">
    <img src="./src/static/logo.svg" alt="Logo" width="80" >
  </a>

<h3 align="center">stxgao.github.io</h3>

  <p align="center">
    A vscode inspired portfolio project
    <br />
    <a href="https://github.com/stxgao/stxgao.github.io/blob/main/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://stxgao.github.io/">View Demo</a>
    ·
    <a href="https://stxgao.github.io/docs">Markdown preview</a>
    ·
    <a href="https://github.com/stxgao/stxgao.github.io/issues">Report Bug</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>        
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#demonstration">Demonstration</a></li> 
    <li><a href="#features">Features</a></li>        
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://stxgao.github.io/)

This project is a VS Code-inspired developer portfolio. It has been completely re-architected to demonstrate modern frontend practices, and bleeding-edge browser AI integration.

* **AI Assistant Integration (Gemini Nano):** Features a fully local AI Assistant powered by Chrome's Built-in Language Model API. The model is seeded with the portfolio's markdown context and via **Few-Shot Prompt Engineering**, it acts as a technical advocate.
* **LLM Streaming Optimization**: Utilizes **Streamdown**, a markdown renderer designed for streaming content from AI models, ensuring fast and stable layouts despite the token-by-token nature of LLMs.
* **Routing & SPA Support**: Upgraded from `HashRouter` to `BrowserRouter` to support proper modern Single Page Application (SPA) architecture with clean URLs for Search Engine Optimization (SEO) and shareable links.
* **State Management:** Migrated to **Zustand** to eliminate prop-drilling, managing complex IDE layouts (e.g., mobile layout, resizable panels, tab history, dark mode, etc.) with persistent, cross-session storage.
* **Build System:** Replaced legacy Webpack (CRA) with **Vite**, delivering sub-second Hot Module Replacement (HMR) and an aggressively optimized production bundle.
* **Design System:** Utilizes **Material UI** with a centralized Theme Factory to codify a strict, responsive IDE design language, including a mobile layout.
* **Accessibility & Semantic Layout:** Rebuilt the core shell using HTML5 semantic landmarks (`<main>`, `<aside>`, `<nav>`, `<footer>`) for superior screen-reader compatibility and SEO. Standardized keyboard interaction patterns and focus states across all interactive elements.
* **Developer Experience (DX):** Established a scalable, modular directory structure decoupling logic (`hooks/`, `store/`, `constants/`) from presentation (`components/`, `layout/`). Enforced consistent codebase styling by introducing centralized `Prettier` configuration.

The pages of the portfolio are powered by `markdown`, which make them easy to modify or add your own content.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [React.js](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [Zustand](https://github.com/pmndrs/zustand)
* [Material UI](https://github.com/mui/material-ui)
* [Chrome Built-in AI (Gemini Nano)](https://developer.chrome.com/docs/ai)
* [Streamdown](https://github.com/vercel/streamdown)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Clone or fork the repo
   ```sh
   git clone https://github.com/stxgao/stxgao.github.io.git
   ```
2. Install npm packages
   ```sh
   npm install
   ```
3. Enter your name in `.env.development`
   ```js
   VITE_APP_NAME=<your_name>
   ```
4. Add your markdown pages in `public/pages`
5. Add your routes in `src/app/constants/pages.ts`, and make sure the names of the pages are consistent with the markdown files.
    ```ts
    export const pages = [
      { index: 0, name: 'docs.md', route: '/docs', visible: false },
      { index: 1, name: 'overview.md', route: '/overview', visible: true },
      { index: 2, name: 'skills.md', route: '/skills', visible: true },
      { index: 3, name: 'experience.md', route: '/experience', visible: true },
      { index: 4, name: 'education.md', route: '/education', visible: true },
      { index: 5, name: 'projects.md', route: '/projects', visible: true },
      { index: 6, name: 'contact.md', route: '/contact', visible: true },
    ];
    ```
6. Add your social links in `src/app/constants/links.tsx`, which will appear in both the sidebar and homepage.
    ```ts
    export const links = [
      {
        index: 0,
        title: 'Find me on Github',
        href: 'https://github.com/stxgao',
        icon: <FaGithub />,
      },
    ];
    ```
7. Configure the AI Assistant system prompt and suggested questions in `src/app/constants/ai.ts` to tailor the assistant's knowledge and persona to your professional background.
8. Serve the app locally
   ```sh
   npm run dev
   ```   
9. Deploy your own portfolio,  
   - modify homepage property in `package.json` 
   ```
   "homepage": "https://{username}.github.io/"
   ```

   - modify Google Analytics measurement id in `.env.production`
   ```
   VITE_APP_NAME=<your_name>
   VITE_APP_MEASUREMENT_ID=<your_measurement_id>   
   ```

### Chrome AI Setup
To test the local AI Assistant, you must use an up to date Chrome version and enable the experimental flags in `chrome://flags`. See the [Chrome AI get started guide](https://developer.chrome.com/docs/ai/get-started) for setup details. It is not yet supported for mobile devices.

### Alternative Deployment
```
docker-compose up
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Demonstration

- The project is deployed to the following domains.
  - [stevengao.dev](https://stevengao.dev)
  - [https://stxgao.github.io/](https://stxgao.github.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Key Features

- Leverages Chrome's Gemini Nano local AI model to answer visitor questions directly from the portfolio context, offering a cutting-edge, private conversational experience.
- Effortlessly create and manage portfolio pages using standard Markdown files.
  - Integrates built-in plugins for rich components, including vibrant syntax highlighting and custom UI alerts.
- Features a collapsible file explorer, dynamic closeable editor tabs, and a responsive layout simulating a real IDE.
  - Material UI light/dark mode toggle featuring automatic system-preference detection.
- Single Page Application (SPA) routing capabilities via React Router (`BrowserRouter`).
- Comes pre-configured with Google Analytics tracking and automated GitHub Actions deployment pipelines.
- Re-architected with **Vite** for near-instant development server startups and optimized production bundling.

Markdown preview: https://stxgao.github.io/docs

### AI Assistant Technical Deep Dive

The AI Assistant is a sophisticated implementation of **Local-First AI**, leveraging Chrome's experimental Built-in AI API (Gemini Nano). It is designed to act as a "Technical Advocate," providing visitors with a conversational interface to explore the portfolio's contents.

**Core Architectural Pillars:**

- **Local Inference & Privacy**: Unlike traditional LLM integrations that rely on cloud APIs (OpenAI, Anthropic), this project performs all inference locally on the user's device. This ensures zero data leakage and eliminates latency associated with network round-trips.
- **Zustand-Powered State Machine**: The AI's lifecycle—availability checking, model downloading, session management, and message streaming—is orchestrated by a centralized Zustand store (`useAIStore.ts`). This provides a reactive, single source of truth for the entire IDE-like interface.
- **[Streamdown](https://github.com/vercel/streamdown) Rendering**: To handle the token-by-token nature of LLMs without UI jitter, the app uses `Streamdown`. This specialized renderer allows for smooth, incremental Markdown updates, including complex elements like syntax-highlighted code blocks and custom MUI alerts.

**Advanced Prompt Engineering Patterns:**

- **Chain of Thought (CoT) Reasoning**: The system prompt enforces a `<thought>` block requirement. By forcing the model to reason about the user's intent and relevant context before generating a response, the accuracy and logical consistency of answers are significantly improved.
- **Few-Shot Conditioning**: The assistant is primed with several high-fidelity examples of how to interact with the portfolio context, ensuring it maintains a professional, technical persona and utilizes the custom citation syntax.

**Agentic Features:**

- **Interactive Citations**: The assistant uses a custom `[[filename.md]]` syntax to refer to portfolio pages. The `MarkdownRenderer` intercepts these tokens and converts them into interactive Material UI Chips that, when clicked, trigger internal app navigation—bridging the gap between LLM output and application state.
- **Visual Thought Trace**: The internal reasoning process of the model is not hidden; it is rendered as a collapsible thought block, providing transparency into how the AI arrived at its conclusion.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Steven Gao - [stevengao.dev](https://stevengao.dev) - steven@stevengao.dev

Project Link: [https://github.com/stxgao/stxgao.github.io](https://github.com/stxgao/stxgao.github.io)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [React Icons](https://react-icons.github.io/react-icons/search)
* [noworneverev.github.io](https://github.com/noworneverev/react-vscode-portfolio)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[forks-shield]: https://img.shields.io/github/forks/stxgao/stxgao.github.io
[forks-url]: https://github.com/stxgao/stxgao.github.io/network/members
[stars-shield]: https://img.shields.io/github/stars/stxgao/stxgao.github.io
[stars-url]: https://github.com/stxgao/stxgao.github.io/stargazers
[issues-shield]: https://img.shields.io/github/issues/stxgao/stxgao.github.io
[issues-url]: https://github.com/stxgao/stxgao.github.io/issues
[license-shield]: https://img.shields.io/github/license/stxgao/stxgao.github.io
[license-url]: https://github.com/stxgao/stxgao.github.io/blob/master/LICENSE.md
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/stxgao/
[product-screenshot]: ./src/static/screenshot.png
[gh-pages-shield]: https://img.shields.io/github/deployments/stxgao/stxgao.github.io/github-pages
[gh-pages-url]: https://github.com/stxgao/stxgao.github.io/deployments
[website-shield]:https://img.shields.io/website?url=https%3A%2F%2Fstxgao.github.io%2F
[website-url]: https://stxgao.github.io/