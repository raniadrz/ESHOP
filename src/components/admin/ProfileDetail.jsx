import React, { useContext, useState, useEffect } from 'react';
import myContext from '../../context/myContext';
import Layout from "../../components/layout/Layout";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from 'react-hot-toast';
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  CssBaseline,
  Grid,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Root = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: 'auto',
}));

const AvatarCollage = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const CollageAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  cursor: 'pointer',
  border: '2px solid transparent',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  '&.selected': {
    border: `2px solid ${theme.palette.secondary.main}`,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  height: '56px', // Ensure the button matches the TextField's height
}));

const defaultAvatars = [
  'https://cdn-icons-png.flaticon.com/128/2202/2202112.png',
  'https://cdn-icons-png.flaticon.com/128/236/236831.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922510.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922656.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922522.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922561.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922715.png'
];

const ProfileDetail = () => {
  const context = useContext(myContext);
  const auth = getAuth();
  const user = auth.currentUser;

  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newName, setNewName] = useState(user?.displayName || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.photoURL || defaultAvatars[0]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setNewName(user.displayName || '');
      setNewEmail(user.email || '');
      setAvatar(user.photoURL || defaultAvatars[0]);
    }
  }, [user]);

  const reauthenticateUser = async () => {
    if (!currentPassword) {
      toast.error('Please enter your current password for re-authentication.');
      return false;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error('Re-authentication failed: ', error);
      toast.error('Re-authentication failed. Please check your password.');
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        // Re-authenticate the user if required
        const isAuthenticated = await reauthenticateUser();
        if (!isAuthenticated) return;

        // Update password if changed
        if (newPassword) {
          await updatePassword(user, newPassword);
          toast.success('Password updated successfully');
        }

        // Upload new avatar if a new image is selected
        if (imageFile) {
          const photoURL = await uploadAvatarToFirebase(imageFile);
          setAvatar(photoURL);
        }

        // Update user details (name and avatar URL in Firestore)
        await context.updateUserDetails(user.uid, newName, newEmail, avatar);
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Failed to update profile: ', error);
        toast.error('Failed to update profile');
      }
    } else {
      console.error('User ID is missing');
    }
  };

  const uploadAvatarToFirebase = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${user.uid}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleAvatarChange = (avatarUrl) => {
    setAvatar(avatarUrl);
    setImageFile(null); // Remove custom image if a default avatar is selected
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setAvatar(URL.createObjectURL(file)); // Show preview of the selected image
  };

  // Function to format the date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats date to MM/DD/YYYY by default
  };

  return (
    <Layout>
      <CssBaseline />
      <Root maxWidth="md">
        <StyledPaper elevation={3}>
          <Box mb={5} textAlign="center">
            <Typography variant="h4" component="h1" color="primary" gutterBottom>
              Profile Setup
            </Typography>
          </Box>

          <Box textAlign="center" mb={1}>
            <StyledAvatar src={avatar} alt="User Avatar" />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-avatar"
              type="file"
              onChange={handleImageFileChange}
            />
            <label htmlFor="upload-avatar">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          <AvatarCollage container spacing={2}>
            {defaultAvatars.map((avatarUrl, index) => (
              <CollageAvatar
                key={index}
                src={avatarUrl}
                onClick={() => handleAvatarChange(avatarUrl)}
                className={avatar === avatarUrl ? 'selected' : ''}
              />
            ))}
          </AvatarCollage>

          <Grid container spacing={4} mt={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Name"
                fullWidth
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Email"
                fullWidth
                value={newEmail}
                InputProps={{
                  readOnly: true,
                }}
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" align="left">
                <strong>Date: </strong>
                {user?.metadata.creationTime ? formatDate(user.metadata.creationTime) : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" align="left">
                <strong>Role: </strong>
                {user?.role || 'User'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    variant="outlined"
                    label="Current Password"
                    type="password"
                    fullWidth
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <SubmitButton
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                  >
                    Update Profile
                  </SubmitButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledPaper>
      </Root>
    </Layout>
  );
};

export default ProfileDetail;
