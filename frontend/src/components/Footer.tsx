import {
  faFacebook,
  faGithub,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Footer as Footerfb } from "flowbite-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Footerfb className="border-black border-2 m-2">
      <footer className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <section className="mt-4">
            <span className="font-bold text-sm sm:text-xl md:text-3xl dark:text-white">
              <Link to="/"> BlogSmith </Link>
            </span>
          </section>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3">
            <section>
              <Footerfb.Title title="About" />
              <Footerfb.LinkGroup col>
                <Footerfb.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Careers
                </Footerfb.Link>
                <Footerfb.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Careers
                </Footerfb.Link>
              </Footerfb.LinkGroup>
            </section>
            <section>
              <Footerfb.Title title="Follow us" />
              <Footerfb.LinkGroup col>
                <Footerfb.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Footerfb.Link>
                <Footerfb.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </Footerfb.Link>
              </Footerfb.LinkGroup>
            </section>
            <section>
              <Footerfb.Title title="Legal" />
              <Footerfb.LinkGroup col>
                <Footerfb.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy policy
                </Footerfb.Link>
                <Footerfb.Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms &amp; conditions
                </Footerfb.Link>
              </Footerfb.LinkGroup>
            </section>
          </div>
        </div>
        <Footerfb.Divider />
        <div className="w-full sm:flex sm:justify-between">
          <Footerfb.Copyright
            href="#"
            by="BlogSmith"
            year={new Date().getFullYear()}
          />
          <section className="flex gap-6 sm:m-1 mt-4 sm:justify-center">
            <Footerfb.Icon
              href="#"
              icon={() => <FontAwesomeIcon icon={faFacebook} />}
            />
            <Footerfb.Icon
              href="#"
              icon={() => <FontAwesomeIcon icon={faInstagram} />}
            />
            <Footerfb.Icon
              href="#"
              icon={() => <FontAwesomeIcon icon={faTwitter} />}
            />
            <Footerfb.Icon
              href="#"
              icon={() => <FontAwesomeIcon icon={faGithub} />}
            />
          </section>
        </div>
      </footer>
    </Footerfb>
  );
};

export default Footer;
