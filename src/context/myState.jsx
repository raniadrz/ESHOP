import {
  createUserWithEmailAndPassword,
  deleteUser as fbDeleteUser,
  getAuth,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fireDB } from "../firebase/FirebaseConfig";
import MyContext from "./myContext";

function MyState({ children }) {
  const [loading, setLoading] = useState(false);
  const [getAllProduct, setGetAllProduct] = useState([]);
  const [getAllOrder, setGetAllOrder] = useState([]);
  const [getAllUser, setGetAllUser] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
// Add Testimonial
const addTestimonial = async (name, comment) => {
  setLoading(true);
  const auth = getAuth();
  const user = auth.currentUser;

  try {
    if (user) {
      await addDoc(collection(fireDB, "testimonials"), {
        name: name || user.displayName,
        comment,
        photoURL: user.photoURL || "", // use user's photo if available
        time: Timestamp.now(), // Use Timestamp for the current time
      });
      toast.success("Testimonial added successfully");
      fetchTestimonials();
    } else {
      throw new Error("User must be logged in to submit a testimonial");
    }
  } catch (error) {
    console.error("Error adding testimonial: ", error);
    toast.error("Failed to add testimonial");
  } finally {
    setLoading(false);
  }
};



   // Fetch testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "testimonials"), orderBy("time", "desc"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let testimonialArray = [];
        QuerySnapshot.forEach((doc) => {
          testimonialArray.push({ ...doc.data(), id: doc.id });
        });
        setTestimonials(testimonialArray); // Get all testimonials
        setLoading(false);
      });
      return () => data();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

     // Delete Testimonial
    const deleteTestimonial = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "testimonials", id));
      toast.success("Testimonial deleted successfully");
      fetchTestimonials(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting testimonial: ", error);
      toast.error("Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  // Create or Update User Details
  const updateUserDetails = async (uid, newName, newEmail, photoURL) => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      if (user) {
        // Update displayName and photoURL in Firebase Authentication
        if (newName !== user.displayName || photoURL !== user.photoURL) {
          await updateProfile(user, { displayName: newName, photoURL: photoURL });
        }

        const userDocRef = doc(fireDB, "user", uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          await updateDoc(userDocRef, {
            name: newName,
            email: newEmail,
            photoURL: photoURL,
          });

          toast.success("User details updated successfully");
        } else {
          await setDoc(userDocRef, {
            name: newName,
            email: newEmail,
            photoURL: photoURL,
            role: user.role || "User",
            time: Timestamp.now(),
          });

          toast.success("User profile created successfully");
        }
        getAllUserFunction();
      } else {
        throw new Error("No user is currently logged in");
      }
    } catch (error) {
      console.error("Error updating user details: ", error);
      toast.error("Failed to update user details");
    } finally {
      setLoading(false);
    }
  };

  // Get All Products
  const getAllProductFunction = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productArray = [];
        QuerySnapshot.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setGetAllProduct(productArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Get All Orders
  const getAllOrderFunction = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "order"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let orderArray = [];
        QuerySnapshot.forEach((doc) => {
          orderArray.push({ ...doc.data(), id: doc.id });
        });
        setGetAllOrder(orderArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Delete Order
  const orderDelete = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "order", id));
      toast.success("Order Deleted successfully");
      getAllOrderFunction();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Get All Users
  const getAllUserFunction = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "user"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let userArray = [];
        QuerySnapshot.forEach((doc) => {
          userArray.push({ ...doc.data(), id: doc.id });
        });
        setGetAllUser(userArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Update User Role
  const updateUserRole = async (uid, currentRole) => {
    setLoading(true);
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const userDocRef = doc(fireDB, "user", uid);
      await updateDoc(userDocRef, {
        role: newRole,
      });
      toast.success(`Role updated to ${newRole}`);
      getAllUserFunction();
    } catch (error) {
      console.error("Error updating role: ", error);
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      const orderDocRef = doc(fireDB, "order", orderId);
      await updateDoc(orderDocRef, {
        status: status,
      });
      toast.success("Order status updated successfully");
      getAllOrderFunction();
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (uid) => {
    setLoading(true);
    try {
      // Delete from Firestore
      const userDocRef = doc(fireDB, "user", uid);
      await deleteDoc(userDocRef);

      // Optionally, delete from Authentication if needed
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        await fbDeleteUser(user);
      }

      toast.success("User deleted successfully");
      getAllUserFunction();
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Create User
  const createUser = async (name, email, password, role = "user") => {
    setLoading(true);
    const auth = getAuth();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      const userDocRef = doc(fireDB, "user", user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        role,
        photoURL: user.photoURL || "",
        time: Timestamp.now(),
      });
      toast.success(`User ${name} created successfully`);
      getAllUserFunction();
    } catch (error) {
      console.error("Error creating user: ", error);
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProductFunction();
    getAllOrderFunction();
    getAllUserFunction();
    fetchTestimonials();
  }, []);

  return (
    <MyContext.Provider
      value={{
        loading,
        setLoading,
        getAllProduct,
        getAllProductFunction,
        getAllOrder,
        orderDelete,
        getAllUser,
        updateUserRole,
        updateUserDetails,
        updateOrderStatus,
        deleteUser,
        createUser, // Add createUser to the context provider
        testimonials,
        addTestimonial,
        getAllTestimonials: testimonials,
        deleteTestimonial,

      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyState;
