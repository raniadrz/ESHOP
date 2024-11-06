import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase/FirebaseConfig';
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

/* eslint-disable react/prop-types */
const Layout = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userData = JSON.parse(localStorage.getItem('user'));
                setUser(userData);
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="main-content min-h-screen">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
