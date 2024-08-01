import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { auth, fireDB } from "../../firebase/FirebaseConfig";

const UserCreationForm = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  // Navigate
  const navigate = useNavigate();

  // User Signup State
  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role is set to "user"
  });

  // State to track form submission
  const [userCreated, setUserCreated] = useState(false);

  /**========================================================================
   *                          User Signup Function
   *========================================================================**/

  const userSignupFunction = async () => {
    // Validation
    if (
      userSignup.name === "" ||
      userSignup.email === "" ||
      userSignup.password === ""
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const users = await createUserWithEmailAndPassword(
        auth,
        userSignup.email,
        userSignup.password
      );

      // Create user object
      const user = {
        name: userSignup.name,
        email: users.user.email,
        uid: users.user.uid,
        role: userSignup.role,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      // Create user reference
      const userReference = collection(fireDB, "user");

      // Add user details
      await addDoc(userReference, user);

      setUserSignup({
        name: "",
        email: "",
        password: "",
        role: "user", // Reset role to default
      });

      toast.success("User created successfully");

      // Set userCreated to true to indicate success
      setUserCreated(true);

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-blue-100 py-12">
      {loading && <Loader />}
      <div className="bg-white p-6 border border-blue-300 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Create a New Account
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={userSignup.name}
            onChange={(e) =>
              setUserSignup({ ...userSignup, name: e.target.value })
            }
            className="w-full bg-blue-50 border border-blue-300 p-3 rounded-lg outline-none placeholder-blue-400 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            value={userSignup.email}
            onChange={(e) =>
              setUserSignup({ ...userSignup, email: e.target.value })
            }
            className="w-full bg-blue-50 border border-blue-300 p-3 rounded-lg outline-none placeholder-blue-400 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={userSignup.password}
            onChange={(e) =>
              setUserSignup({ ...userSignup, password: e.target.value })
            }
            className="w-full bg-blue-50 border border-blue-300 p-3 rounded-lg outline-none placeholder-blue-400 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="mb-6">
          <select
            value={userSignup.role}
            onChange={(e) =>
              setUserSignup({ ...userSignup, role: e.target.value })
            }
            className="w-full bg-blue-50 border border-blue-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="button"
          onClick={userSignupFunction}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors duration-300"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default UserCreationForm;
