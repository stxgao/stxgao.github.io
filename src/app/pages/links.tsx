import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaSpotify,
  FaFilePdf,
} from "react-icons/fa";

export const links = [
  {
    index: 0,
    title: "Find me on Github",
    href: "https://github.com/stxgao",
    icon: <FaGithub />,
  },
  {
    index: 1,
    title: "Find me on LinkedIn",
    href: "https://www.linkedin.com/in/stxgao/",
    icon: <FaLinkedin />,
  },
  {
    index: 2,
    title: "Contact me via Email",
    href: "mailto:steven@stevengao.dev",
    icon: <FaEnvelope />,
  },
  {
    index: 3,
    title: "View my Spotify",
    href: "https://open.spotify.com/artist/3Tb6ZgyQYziuEJfpooFoXk",
    icon: <FaSpotify />,
  },
  {
    index: 4,
    title: "View my Resume",
    href: "../../static/resume.pdf",
    icon: <FaFilePdf />,
  },
];
