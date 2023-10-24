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
    <a href="https://stxgao.github.io/#/docs">Markdown preview</a>
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

[![Product Name Screen Shot][screenshot]](https://stxgao.github.io/)

The project is inspired by [Visual Studio Code](https://github.com/microsoft/vscode) and [caglarturali.github.io](https://github.com/caglarturali/caglarturali.github.io). The pages of the portfolio are powered by `markdown`, which make them easy to modify or add your own contents.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [React.js](https://reactjs.org/)
* [Material UI](https://github.com/mui/material-ui)
* [react-markdown](https://github.com/remarkjs/react-markdown)

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
   REACT_APP_NAME=<your_name>
   ```
4. Add your markdown pages in `public/pages`
5. Add your routes in `src/app/pages/page.ts`, make sure the names of the pages are consistent with the markdown files.
    ```ts
    export const pages = [
      { index: 0, name: 'steven-gao.md', route: '/overview', visible: true },
      { index: 1, name: 'skills.md', route: '/skills', visible: true },
      { index: 2, name: 'experience.md', route: '/experience', visible: true },
      { index: 3, name: 'education.md', route: '/education', visible: true },
      { index: 4, name: 'projects.md', route: '/projects', visible: true },
      { index: 5, name: 'contact.md', route: '/contact', visible: true },
      { index: 6, name: 'docs.md', route: '/docs', visible: false },  
    ];
    ```
6. Add your social links in `src/app/pages/links.tsx`, which will appear in both the sidebar and homepage.
    ```ts
    export const links = [
      {
        index: 0,
        title: "Find me on Github",
        href: "https://github.com/stxgao",
        icon: <FaGithub />,
      },
    ];
    ```
7. Serve the app locally
   ```sh
   npm start
   ```   
8. Deploy your own portfolio,  
   - modify homepage property in `package.json` 
   ```
   "homepage": "https://{username}.github.io/"
   ```

   - modify Google Analytics measurement id in `.env.production`
   ```
   REACT_APP_NAME=<your_name>
   REACT_APP_MEASUREMENT_ID=<your_measurement_id>   
   ```

### Alternative Deployment
```
docker-compose up
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Demonstration

- The project is deployed to the following domains, and they are in synchronization.
  - stevengao.dev
  - user site: [https://stxgao.github.io/](https://stxgao.github.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Features

- Powered by markdown
- Extended markdown syntax supported
  - Syntax highlight
  - Alert
- Dark mode and light mode available
- Closeable tabs
- Collapsible explorer
- Responsive web design
- Google Analytics supported
- Auto-deploy to gh-pages and github actions ready

Markdown preview: https://stxgao.github.io/#/docs

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.md` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Steven Gao - [Personal Portfolio](https://stxgao.github.io/) - steven@stevengao.dev

Project Link: [https://github.com/stxgao/stxgao.github.io](https://github.com/stxgao/stxgao.github.io)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [React Icons](https://react-icons.github.io/react-icons/search)
* [caglarturali.github.io](https://github.com/caglarturali/caglarturali.github.io)

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
[linkedin-url]: https://www.linkedin.com/in/yan-ying-liao/
[product-screenshot]: ./src/static/screenshot.gif
[gh-pages-shield]: https://img.shields.io/github/deployments/stxgao/stxgao.github.io/github-pages
[gh-pages-url]: https://github.com/stxgao/stxgao.github.io/deployments
[website-shield]:https://img.shields.io/website?url=https%3A%2F%2Fstxgao.github.io%2F
[website-url]: https://stxgao.github.io/