// UpdatePassword.jsx
import { getAuth, updatePassword } from 'firebase/auth';

const updateFirebasePassword = async (newPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            await updatePassword(user, newPassword);
            alert('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password:', error.message);
        }
    } else {
        alert('No user is signed in.');
    }
};

export default updateFirebasePassword;