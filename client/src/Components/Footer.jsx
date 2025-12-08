import {
  Facebook,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TwitterIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkSections = [
    {
      title: "PRODUCTS",
      links: [
        { text: "Earphones", path: "/", icon: null },
        { text: "Headphones", path: "/", icon: null },
        { text: "Smartphones", path: "/", icon: null },
        { text: "Laptops", path: "/", icon: null },
      ],
    },
    {
      title: "WEBSITE?",
      links: [
        { text: "Home", path: "/", icon: null },
        { text: "Privacy Policy", path: "/", icon: null },
        { text: "Become Plus Member", path: "/pricing", icon: null },
        { text: "Create Your Store", path: "/create-store", icon: null },
      ],
    },
    {
      title: "CONTACT",
      links: [
        { text: "+1-212-456-7890", path: "/", icon: MailIcon },
        { text: "contact@example.com", path: "/", icon: PhoneIcon },
        { text: "794 Francisco, 94102", path: "/", icon: MapPinIcon },
      ],
    },
  ];

  const socialIcons = [
    { icon: Facebook, link: "https://www.facebook.com" },
    { icon: InstagramIcon, link: "https://www.instagram.com" },
    { icon: TwitterIcon, link: "https://twitter.com" },
    { icon: LinkedinIcon, link: "https://www.linkedin.com" },
  ];

  return (
    <footer className="mx-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-slate-500/30 text-slate-500">
          <div>
            <Link to="/" className="text-4xl font-semibold text-slate-700">
              <span className="text-green-600">go</span>cart
              <span className="text-green-600 text-5xl leading-0">.</span>
            </Link>
            <p className="max-w-[410px] mt-6 text-sm">
              Welcome to SwiftCart, your ultimate destination for the latest and
              smartest gadgets. From smartphones and smartwatches to essential
              accessories, we bring you the best in innovation — all in one
              place.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialIcons.map((item, i) => (
                <Link
                  to={item.link}
                  key={i}
                  className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:scale-105 hover:border border-slate-300 transition rounded-full"
                >
                  <item.icon />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5 text-sm ">
            {linkSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-medium text-slate-700 md:mb-5 mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {link.icon && <link.icon />}
                      <Link
                        to={link.path}
                        className="hover:underline transition"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="py-4 text-sm text-slate-500">
          Copyright 2025 © gocart All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
