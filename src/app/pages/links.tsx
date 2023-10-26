import { VscGithub, VscMail, VscFilePdf } from "react-icons/vsc";
import { FaLinkedinIn } from "react-icons/fa";


export const links = [
  {
    index: 0,
    title: "Find me on Github",
    href: "https://github.com/stxgao",
    icon: <VscGithub />,
  },
  {
    index: 1,
    title: "Connect with me on LinkedIn",
    href: "https://www.linkedin.com/in/stxgao/",
    icon: <FaLinkedinIn />,
  },
  {
    index: 2,
    title: "Shoot me an Email",
    href: "mailto:steven@stevengao.dev",
    icon: <VscMail />,
  },
  {
    index: 3,
    title: "View my Resume",
    href: "../../resume.pdf",
    icon: <VscFilePdf />,
  },
];
