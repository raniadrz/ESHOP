import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-gray-100">
      <div className="container mx-auto py-8 px-5">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-start">

          {/* Links Section */}
          <div className="flex w-full md:w-3/3 justify-between">
            {/* Customer Service */}
            <div className="w-1/2 md:w-1/3 mb-6 md:mb-0">
              <h2 className="font-medium text-white text-sm tracking-widest mb-3 uppercase">
                Customer Service
              </h2>
              <ul className="list-none">
                <li className="mb-2">
                  <Link to="/returnpolicy" className="text-gray-100 hover:text-gray-300">Return Policy</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about" className="text-gray-100 hover:text-gray-300">About</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-100 hover:text-gray-300">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="w-1/2 md:w-3/3">
              <h2 className="font-medium text-white text-sm tracking-widest mb-3 uppercase">
                Services
              </h2>
              <ul className="list-none">
                <li className="mb-2">
                  <Link to="/privacypolicy" className="text-gray-100 hover:text-gray-300">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>

         

        </div>

         {/* Logo Section */}
         <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <p className="mt-4 text-gray-100 text-sm">
              © 2024 Chic Tails Boutique
            </p>
          </div>
      </div>
    </footer>
  );
};
export default Footer;