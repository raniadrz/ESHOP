import { Link } from "react-router-dom";
import logo from "../../../public/logo.png";
const Footer = () => {
  return (
    <footer className="bg-white text-black py-16">
      <div className="container mx-auto px-5">
        {/* Logo and Navigation Sections */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-start mb-12">
          {/* Logo Section */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <img 
              src={logo} 
              alt="Pet Paradise  Logo" 
              className="w-32"
            />
            <h1 className="text-2xl mt-4">Pet Paradise </h1>
          </div>

          {/* Navigation Sections */}
          <div className="flex flex-wrap md:flex-nowrap justify-between w-full md:w-3/4 text-center">
            {/* About Us Section */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-xl mb-4">About Us</h2>
              <ul className="space-y-2">
                <li><Link to="/mission" className="hover:underline">Mission</Link></li>
                <li><Link to="/team" className="hover:underline">Team</Link></li>
                <li><Link to="/newsletter" className="hover:underline">Newsletter</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-xl mb-4">Support</h2>
              <ul className="space-y-2">
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                <li><Link to="/refund-policy" className="hover:underline">Refund Policy</Link></li>
                <li><Link to="/faqs" className="hover:underline">FAQ's</Link></li>
              </ul>
            </div>

            {/* Social Section */}
            <div className="w-full md:w-1/3">
              <h2 className="text-xl mb-4">Social</h2>
              <ul className="space-y-2">
                <li><a href="https://instagram.com" className="hover:underline">Instagram</a></li>
                <li><a href="https://linkedin.com" className="hover:underline">LinkedIn</a></li>
                <li><a href="https://youtube.com" className="hover:underline">YouTube</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
          <p className="text-sm">Copyright © Pet Paradise </p>
          <div className="flex items-center gap-8">
            <Link to="/terms" className="text-sm hover:underline">Terms of Service</Link>
            <button onClick={() => window.scrollTo(0, 0)} className="text-sm hover:underline flex items-center">
              Back to top
              <span className="ml-2 border border-black px-2">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;