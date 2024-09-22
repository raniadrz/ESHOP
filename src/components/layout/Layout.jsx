import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { Analytics } from "@vercel/analytics/react"

/* eslint-disable react/prop-types */
const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className="main-content min-h-screen">
                {children}
            </div>
            <Footer />
            <Analytics debug={true} /> {/* This will log debug info to the console */}
        </div>
    );
}

export default Layout;
