import React, { createContext, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, setDoc, addDoc } from 'firebase/firestore';
import { getAuth, updateEmail, updateProfile, deleteUser as fbDeleteUser } from 'firebase/auth';
import toast from 'react-hot-toast';
import { fireDB } from '../firebase/FirebaseConfig';
import MyContext from './myContext';

function MyState({ children }) {
    const [loading, setLoading] = useState(false);
    const [getAllProduct, setGetAllProduct] = useState([]);
    const [getAllOrder, setGetAllOrder] = useState([]);
    const [getAllUser, setGetAllUser] = useState([]);
    const [coupons, setCoupons] = useState([]);

    const fetchCoupons = async () => {
        const querySnapshot = await getDocs(collection(fireDB, "coupons"));
        const couponsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCoupons(couponsArray);
    };

    const updateUserDetails = async (uid, newName, newEmail, photoURL) => {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;

        try {
            if (user) {
                if (newEmail !== user.email) {
                    await updateEmail(user, newEmail);
                }
                if (newName !== user.displayName || photoURL !== user.photoURL) {
                    await updateProfile(user, { displayName: newName, photoURL: photoURL });
                }

                const userDocRef = doc(fireDB, "users", uid);
                const docSnapshot = await getDoc(userDocRef);

                if (docSnapshot.exists()) {
                    await updateDoc(userDocRef, {
                        name: newName,
                        email: newEmail,
                        photoURL: photoURL
                    });

                    toast.success('User details updated successfully');
                    getAllUserFunction();
                } else {
                    await setDoc(userDocRef, {
                        name: newName,
                        email: newEmail,
                        photoURL: photoURL,
                        role: user.role || 'User',
                        time: user.metadata.creationTime
                    });

                    toast.success('User profile created successfully');
                    getAllUserFunction();
                }
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

    const getAllProductFunction = async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, "products"), orderBy('time'));
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

    const getAllOrderFunction = async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, "order"), orderBy('time'));
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

    const orderDelete = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'order', id));
            toast.success('Order Deleted successfully');
            getAllOrderFunction();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getAllUserFunction = async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, "user"), orderBy('time'));
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

    const updateUserRole = async (uid, currentRole) => {
        setLoading(true);
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const userDocRef = doc(fireDB, "user", uid);
            await updateDoc(userDocRef, {
                role: newRole
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

    const updateOrderStatus = async (orderId, status) => {
        setLoading(true);
        try {
            const orderDocRef = doc(fireDB, "order", orderId);
            await updateDoc(orderDocRef, {
                status: status
            });
            toast.success('Order status updated successfully');
            getAllOrderFunction();
        } catch (error) {
            console.error("Error updating order status: ", error);
            toast.error("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    const addCoupon = async (coupon) => {
        try {
            await addDoc(collection(fireDB, "coupons"), coupon);
            toast.success("Coupon added successfully!");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to add coupon!");
            console.error("Error adding coupon: ", error);
        }
    };

    const deleteCoupon = async (id) => {
        try {
            await deleteDoc(doc(fireDB, "coupons", id));
            toast.success("Coupon deleted successfully!");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete coupon!");
            console.error("Error deleting coupon: ", error);
        }
    };

    const updateCoupon = async (id, updatedCoupon) => {
        try {
            await updateDoc(doc(fireDB, "coupons", id), updatedCoupon);
            toast.success("Coupon updated successfully!");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to update coupon!");
            console.error("Error updating coupon: ", error);
        }
    };

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

    useEffect(() => {
        getAllProductFunction();
        getAllOrderFunction();
        getAllUserFunction();
        fetchCoupons();
    }, []);

    return (
        <MyContext.Provider value={{
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
            coupons, 
            addCoupon, 
            deleteCoupon,
            updateCoupon,
            fetchCoupons,
            deleteUser, // Add deleteUser to the context provider
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyState;
