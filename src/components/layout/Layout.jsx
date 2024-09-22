import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/react"

/* eslint-disable react/prop-types */
const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className="main-content min-h-screen">
                {children}
            </div>
            <Footer />
            <SpeedInsights/>
        </div>
    );
}

export default Layout;
