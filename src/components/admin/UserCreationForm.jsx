import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { auth, fireDB } from "../../firebase/FirebaseConfig";

const countryList = [
  { name: "Albania" },
  { name: "Andorra" },
  { name: "Armenia" },
  { name: "Austria" },
  { name: "Azerbaijan" },
  { name: "Belarus" },
  { name: "Belgium" },
  { name: "Bosnia and Herzegovina" },
  { name: "Bulgaria" },
  { name: "Croatia" },
  { name: "Cyprus" },
  { name: "Czech Republic" },
  { name: "Denmark" },
  { name: "Estonia" },
  { name: "Finland" },
  { name: "France" },
  { name: "Georgia" },
  { name: "Germany" },
  { name: "Greece" },
  { name: "Hungary" },
  { name: "Iceland" },
  { name: "Ireland" },
  { name: "Italy" },
  { name: "Kazakhstan" },
  { name: "Kosovo" },
  { name: "Latvia" },
  { name: "Liechtenstein" },
  { name: "Lithuania" },
  { name: "Luxembourg" },
  { name: "Malta" },
  { name: "Moldova" },
  { name: "Monaco" },
  { name: "Montenegro" },
  { name: "Netherlands" },
  { name: "North Macedonia" },
  { name: "Norway" },
  { name: "Poland" },
  { name: "Portugal" },
  { name: "Romania" },
  { name: "Russia" },
  { name: "San Marino" },
  { name: "Serbia" },
  { name: "Slovakia" },
  { name: "Slovenia" },
  { name: "Spain" },
  { name: "Sweden" },
  { name: "Switzerland" },
  { name: "Turkey" },
  { name: "Ukraine" },
  { name: "United Kingdom" },
  { name: "Vatican City" }
];


const UserCreationForm = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  // User Signup State
  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    country: "",
    profession: "",
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
      userSignup.password === "" ||
      userSignup.dateOfBirth === "" ||
      userSignup.country === "" ||
      userSignup.profession === ""
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
        dateOfBirth: userSignup.dateOfBirth,
        country: userSignup.country,
        profession: userSignup.profession,
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
        dateOfBirth: "",
        country: "",
        profession: "",
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
    <div className="flex justify-center items-start min-h-screen bg-blue-100 py-100">
      {loading && <Loader />}
      <div className="bg-white p-6 border border-blue-300 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
          Create a New Account
        </h2>

        <div className="mb-2">
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

        <div className="mb-2">
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

        <div className="mb-2">
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

        <div className="mb-2">
          <input
            type="date"
            placeholder="Date of Birth"
            value={userSignup.dateOfBirth}
            onChange={(e) =>
              setUserSignup({ ...userSignup, dateOfBirth: e.target.value })
            }
            className="w-full bg-blue-50 border border-blue-300 p-3 rounded-lg outline-none placeholder-blue-400 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="mb-2">
          <select
            value={userSignup.country}
            onChange={(e) =>
              setUserSignup({ ...userSignup, country: e.target.value })
            }
            className="w-full bg-blue-50 border border-blue-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Country</option>
            {countryList.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <input
            type="text"
            placeholder="Profession"
            value={userSignup.profession}
            onChange={(e) =>
              setUserSignup({ ...userSignup, profession: e.target.value })
            }
            className="w-full bg-blue-50 border border-blue-300 p-3 rounded-lg outline-none placeholder-blue-400 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="mb-2">
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
