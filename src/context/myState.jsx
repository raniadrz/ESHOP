/* eslint-disable react/prop-types */
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc ,setDoc} from 'firebase/firestore';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fireDB } from '../firebase/FirebaseConfig';
import MyContext from './myContext';

function MyState({ children }) {
    const [loading, setLoading] = useState(false);
    const [getAllProduct, setGetAllProduct] = useState([]);
    const [getAllOrder, setGetAllOrder] = useState([]);
    const [getAllUser, setGetAllUser] = useState([]);

    const updateUserDetails = async (uid, newName, newEmail, photoURL) => {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;
      
        try {
          if (user) {
            // Update email and profile in Firebase Auth
            if (newEmail !== user.email) {
              await updateEmail(user, newEmail);
            }
            if (newName !== user.displayName || photoURL !== user.photoURL) {
              await updateProfile(user, { displayName: newName, photoURL: photoURL });
            }
      
            // Check if the document exists in Firestore
            const userDocRef = doc(fireDB, "users", uid); // Ensure the collection name is correct
            const docSnapshot = await getDoc(userDocRef);
      
            if (docSnapshot.exists()) {
              // Update Firestore document
              await updateDoc(userDocRef, {
                name: newName,
                email: newEmail,
                photoURL: photoURL
              });
      
              toast.success('User details updated successfully');
              getAllUserFunction();
            } else {
              // If document does not exist, create a new one
              await setDoc(userDocRef, {
                name: newName,
                email: newEmail,
                photoURL: photoURL,
                role: user.role || 'User', // Handle undefined role
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
    }

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
    }

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
    }

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
    }

    const updateUserRole = async (uid, currentRole) => {
        setLoading(true);
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const userDocRef = doc(fireDB, "user", uid);
            console.log(`Updating user ${uid} role to ${newRole}`); 
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
    }
      
    

    useEffect(() => {
        getAllProductFunction();
        getAllOrderFunction();
        getAllUserFunction();
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
            updateUserDetails 
        }}>
            {children}
        </MyContext.Provider>
    )
}

export default MyState;
