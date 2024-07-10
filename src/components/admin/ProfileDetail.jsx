import React, { useContext, useState, useEffect } from 'react';
import myContext from '../../context/myContext';
import Layout from "../../components/layout/Layout";
import updatePassword from "../../components/user/UpdatePassword";
import { getAuth } from 'firebase/auth';
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

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const SaveButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
}));

const defaultAvatars = [
  'https://cdn-icons-png.flaticon.com/128/2202/2202112.png',
  'https://cdn-icons-png.flaticon.com/128/236/236831.png',
  'https://cdn-icons-png.flaticon.com/128/1946/1946429.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922510.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922656.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922522.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922561.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922636.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922665.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922715.png'
];

const ProfileDetail = () => {
  const context = useContext(myContext);
  const auth = getAuth();
  const user = auth.currentUser;

  const [newPassword, setNewPassword] = useState('');
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

  const handlePasswordChange = () => {
    updatePassword(newPassword);
  };

  const handleDetailsChange = async () => {
    if (user) {
      try {
        await context.updateUserDetails(user.uid, newName, newEmail, avatar);
        toast.success('Details updated successfully');
      } catch (error) {
        console.error("Failed to update user details: ", error);
        toast.error("Failed to update details");
      }
    } else {
      console.error("User ID is missing");
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

  const handleSaveAvatar = async () => {
    if (user) {
      try {
        let photoURL = avatar;

        if (imageFile) {
          photoURL = await uploadAvatarToFirebase(imageFile);
          setAvatar(photoURL); // Update avatar state after successful upload
        }

        await context.updateUserDetails(user.uid, user.displayName, user.email, photoURL);
        toast.success('Avatar updated successfully');
      } catch (error) {
        console.error("Failed to update avatar: ", error);
        toast.error("Failed to update avatar");
      }
    } else {
      console.error("User ID is missing");
    }
  };

  return (
    <Layout>
      <CssBaseline />
      <Root maxWidth="md">
        <StyledPaper elevation={3}>
          <Box mb={5} textAlign="center">
            <Typography variant="h4" component="h1" color="primary" gutterBottom>
              Admin Dashboard
            </Typography>
          </Box>

          <Box textAlign="center" mb={5}>
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

          <Grid container spacing={2} justifyContent="center">
            {defaultAvatars.map((avatarUrl, index) => (
              <Grid item key={index} onClick={() => handleAvatarChange(avatarUrl)}>
                <Avatar src={avatarUrl} style={{ cursor: 'pointer' }} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} mt={2}>
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
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                <strong>Date: </strong>
                {user?.metadata.creationTime}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
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
            <Grid item xs={12} textAlign="center">
              <SubmitButton
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
              >
                Update Password
              </SubmitButton>
              <SaveButton
                variant="contained"
                color="secondary"
                onClick={handleSaveAvatar}
              >
                Save Avatar
              </SaveButton>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <SubmitButton
                variant="contained"
                color="secondary"
                onClick={handleDetailsChange}
              >
                Update Details
              </SubmitButton>
            </Grid>
          </Grid>
        </StyledPaper>
      </Root>
    </Layout>
  );
};

export default ProfileDetail;
