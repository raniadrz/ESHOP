// UpdateEmail.js
import { getAuth, updateEmail } from 'firebase/auth';

const UpdateEmail = async (newEmail) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            await updateEmail(user, newEmail);
            alert('Email updated successfully!');
        } catch (error) {
            console.error('Error updating email:', error);
            alert('Error updating email:', error.message);
        }
    } else {
        alert('No user is signed in.');
    }
};

export default UpdateEmail;
