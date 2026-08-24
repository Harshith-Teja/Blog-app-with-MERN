import {
  faFacebook,
  faGithub,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 pt-12 pb-8 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Tagline (Takes up 1 column) */}
          <div className="md:col-span-1 flex flex-col items-start">
            <Link
              to="/"
              className="mb-4 hover:scale-105 transition-transform duration-300"
            >
              <span className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                BlogSmith
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Forge your thoughts into powerful posts. Join our growing
              community of creators today.
            </p>
          </div>

          {/* Links Grid (Takes up remaining 3 columns) */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <section>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">
                About
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">
                Follow Us
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    Twitter (X)
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">
                Legal
              </h3>
              <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-slate-200 dark:border-slate-800/60" />

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            © {new Date().getFullYear()}{" "}
            <Link
              to="/"
              className="text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              BlogSmith™
            </Link>
            . All rights reserved.
          </span>

          <div className="flex gap-6 text-slate-400 dark:text-slate-500">
            <a
              href="#"
              className="hover:text-cyan-500 dark:hover:text-cyan-400 hover:-translate-y-1 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faFacebook} className="text-xl" />
            </a>
            <a
              href="#"
              className="hover:text-pink-500 dark:hover:text-pink-400 hover:-translate-y-1 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-xl" />
            </a>
            <a
              href="#"
              className="hover:text-blue-400 dark:hover:text-blue-400 hover:-translate-y-1 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-xl" />
            </a>
            <a
              href="#"
              className="hover:text-slate-800 dark:hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faGithub} className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
