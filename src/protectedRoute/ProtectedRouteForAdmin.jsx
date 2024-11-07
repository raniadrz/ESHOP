/* eslint-disable react/prop-types */
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fireDB } from '../firebase/FirebaseConfig';

export function ProtectedRouteForAdmin({ children }) {
  const auth = getAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(fireDB, "user", user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}