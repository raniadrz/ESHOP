/* eslint-disable react/no-unescaped-entities */
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import './Login.css'; // Import the CSS file

const Login = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    // navigate 
    const navigate = useNavigate();

    // User Login State 
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    // State for forgot password email
    const [resetEmail, setResetEmail] = useState("");

    // State for showing/hiding forgot password form
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    /**========================================================================
     *                          User Login Function 
    *========================================================================**/

    const userLoginFunction = async () => {
        // validation 
        if (userLogin.email === "" || userLogin.password === "") {
            toast.error("All Fields are required");
            return;
        }

        setLoading(true);
        try {
            const users = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);

            try {
                const q = query(
                    collection(fireDB, "user"),
                    where('uid', '==', users?.user?.uid)
                );
                const data = onSnapshot(q, (QuerySnapshot) => {
                    let user;
                    QuerySnapshot.forEach((doc) => user = doc.data());
                    localStorage.setItem("users", JSON.stringify(user));
                    setUserLogin({
                        email: "",
                        password: ""
                    });
                    toast.success("Login Successfully");
                    setLoading(false);
                    if (user.role === "user") {
                        navigate('/user-dashboard');
                    } else {
                        navigate('/admin-dashboard');
                    }
                });
                return () => data;
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Login Failed");
        }
    };

    const handlePasswordReset = async () => {
        if (resetEmail === "") {
            toast.error("Email is required");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            toast.success("Password reset email sent");
            setLoading(false);
            setShowForgotPassword(false);
            setResetEmail("");
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Failed to send password reset email");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-image'>
            {loading && <Loader />}
            <div className="login_Form px-8 py-6 border border-blue-100 rounded-xl shadow-md">

                <div className="mb-5">
                    <h2 className='text-center text-2xl font-bold text-blue-500 '>
                        {showForgotPassword ? "Reset Password" : "Login"}
                    </h2>
                </div>

                {showForgotPassword ? (
                    <div>
                        <div className="mb-3">
                            <input
                                type="email"
                                name="email"
                                placeholder='Email Address'
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className='bg-blue-50 border border-blue-400 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-200'
                            />
                        </div>
                        <div className="mb-5">
                            <button
                                type='button'
                                onClick={handlePasswordReset}
                                className='bg-blue-500 hover:bg-blue-600 w-full text-white text-center py-2 font-bold rounded-md '
                            >
                                Send Reset Link
                            </button>
                        </div>
                        <div>
                            <h2 className='text-black'>Remember your password? <span className='text-blue-500 font-bold cursor-pointer' onClick={() => setShowForgotPassword(false)}>Login</span></h2>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-3">
                            <input
                                type="email"
                                name="email"
                                placeholder='Email Address'
                                value={userLogin.email}
                                onChange={(e) => {
                                    setUserLogin({
                                        ...userLogin,
                                        email: e.target.value
                                    });
                                }}
                                className='bg-blue-50 border border-blue-400 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-200'
                            />
                        </div>

                        <div className="mb-5">
                            <input
                                type="password"
                                placeholder='Password'
                                value={userLogin.password}
                                onChange={(e) => {
                                    setUserLogin({
                                        ...userLogin,
                                        password: e.target.value
                                    });
                                }}
                                className='bg-blue-50 border border-blue-400 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-200'
                            />
                        </div>

                        <div className="mb-5">
                            <button
                                type='button'
                                onClick={userLoginFunction}
                                className='bg-blue-500 hover:bg-blue-600 w-full text-white text-center py-2 font-bold rounded-md '
                            >
                                Login
                            </button>
                        </div>

                        <div className="mb-3">
                            <h2 className='text-black'>Forgot your password? <span className='text-blue-500 font-bold cursor-pointer' onClick={() => setShowForgotPassword(true)}>Reset Password</span></h2>
                        </div>

                        <div>
                            <h2 className='text-black'>Don't Have an account <Link className=' text-blue-500 font-bold' to={'/signup'}>Signup</Link></h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
