import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaSpotify,
  FaFileAlt,
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
    title: "Connect with me on LinkedIn",
    href: "https://www.linkedin.com/in/stxgao/",
    icon: <FaLinkedin />,
  },
  {
    index: 2,
    title: "Follow me on Instagram",
    href: "https://www.instagram.com/stxgao/",
    icon: <FaInstagram />,
  },
  {
    index: 3,
    title: "Checkout my Spotify",
    href: "https://open.spotify.com/artist/3Tb6ZgyQYziuEJfpooFoXk",
    icon: <FaSpotify />,
  },
  {
    index: 4,
    title: "Shoot me an Email",
    href: "mailto:steven@stevengao.dev",
    icon: <FaEnvelope />,
  },
  {
    index: 5,
    title: "View my Resume",
    href: "../../resume.pdf",
    icon: <FaFileAlt />,
  },
];
