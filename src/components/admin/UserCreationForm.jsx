import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { Toaster } from 'react-hot-toast';
import CustomToast from '../../components/CustomToast/CustomToast';

import "./userCreationForm.css"; 

const countryList = [
  "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium",
  "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece",
  "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia",
  "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco",
  "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal",
  "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain",
  "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City"
];

const UserCreationForm = () => {
  const { loading, setLoading } = useContext(myContext);

  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    country: "",
    profession: "",
    role: "user",
  });

  const showCustomToast = (type, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          type={type}
          message={message}
          onClose={() => {
            toast.dismiss(t.id);
          }}
        />
      ),
      {
        duration: 1500,
        position: 'bottom-center',
        id: `${type}-${Date.now()}`,
      }
    );
  };

  const userSignupFunction = async () => {
    // More strict email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(userSignup.email)) {
      showCustomToast('error', 'Your email address is invalid');
      return;
    }

    // Validate password length
    if (userSignup.password.length < 6) {
      showCustomToast('error', 'Password must be at least 6 characters long');
      return;
    }

    // Validate all fields are filled
    if (Object.values(userSignup).some(value => value === "")) {
      showCustomToast('error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userSignup.email,
        userSignup.password
      );

      // Create user document in Firestore
      const user = {
        name: userSignup.name.trim(),
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        dateOfBirth: userSignup.dateOfBirth,
        country: userSignup.country,
        profession: userSignup.profession.trim(),
        role: userSignup.role,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        status: true
      };

      // Add to Firestore
      await addDoc(collection(fireDB, "user"), user);

      // Reset form
      setUserSignup({
        name: "",
        email: "",
        password: "",
        dateOfBirth: "",
        country: "",
        profession: "",
        role: "user",
      });

      showCustomToast('success', 'Your account has been saved');
    } catch (error) {
      console.error("Error creating user:", error);
      
      let errorMessage;
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Your email address is invalid';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          errorMessage = 'Failed to create user. Please try again.';
      }
      
      showCustomToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
        }}
      />
      {loading && <div className="loader-container"><Loader /></div>}
      <h2>Create a New Account</h2>

      <div className="form-field">
        <input
          type="text"
          placeholder="Full Name"
          value={userSignup.name}
          onChange={(e) => setUserSignup({ ...userSignup, name: e.target.value })}
        />
      </div>

      <div className="form-field">
        <input
          type="email"
          placeholder="Email Address"
          value={userSignup.email}
          onChange={(e) => setUserSignup({ ...userSignup, email: e.target.value })}
        />
      </div>

      <div className="form-field">
        <input
          type="password"
          placeholder="Password"
          value={userSignup.password}
          onChange={(e) => setUserSignup({ ...userSignup, password: e.target.value })}
        />
      </div>

      <div className="form-field">
        <input
          type="date"
          placeholder="Date of Birth"
          value={userSignup.dateOfBirth}
          onChange={(e) => setUserSignup({ ...userSignup, dateOfBirth: e.target.value })}
        />
      </div>

      <div className="form-field">
        <select
          value={userSignup.country}
          onChange={(e) => setUserSignup({ ...userSignup, country: e.target.value })}
        >
          <option value="">Select Country</option>
          {countryList.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <input
          type="text"
          placeholder="Profession"
          value={userSignup.profession}
          onChange={(e) => setUserSignup({ ...userSignup, profession: e.target.value })}
        />
      </div>

      <div className="form-field">
        <select
          value={userSignup.role}
          onChange={(e) => setUserSignup({ ...userSignup, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button type="button" onClick={userSignupFunction}>
        Create
      </button>
    </div>
  );
};

export default UserCreationForm;
