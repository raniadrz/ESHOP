// Comments.js
import React, { useState, useEffect, useContext } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './Comments.css'; // Import the CSS file

const Comments = ({ productId }) => {
    const { loading, setLoading } = useContext(myContext);
    const auth = getAuth();
    const user = auth.currentUser;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!productId) {
            toast.error("Product ID is missing");
            return;
        }

        const q = query(
            collection(fireDB, "comments"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsArray = snapshot.docs
                .filter((doc) => doc.data().productId === productId)
                .map((doc) => ({ id: doc.id, ...doc.data() }));

            setComments(commentsArray);
        });

        return () => unsubscribe();
    }, [productId]);

    const handleCommentSubmit = async () => {
        if (!productId) {
            toast.error("Product ID is missing");
            return;
        }

        if (!newComment.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        if (!user) {
            toast.error("You must be logged in to post a comment");
            return;
        }

        // Ensure the user has a display name or fall back to email (or another identifier)
        const userName = user.displayName || user.email || "Anonymous User";

        setLoading(true);
        try {
            let imageUrl = null;
            if (image) {
                const storage = getStorage();
                const imageRef = ref(storage, `comments/${user.uid}_${Date.now()}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            const commentData = {
                productId,
                userName: userName, // Save the user's name (display name or fallback)
                text: newComment,
                photoURL: imageUrl,
                createdAt: new Date(),
            };

            await addDoc(collection(fireDB, "comments"), commentData);

            setNewComment("");
            setImage(null);
            toast.success("Comment added successfully!");
        } catch (error) {
            console.error("Error adding comment: ", error);
            toast.error("Failed to add comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comments-container">
            <h3>Comments</h3>
            {user ? (
                <div className="comment-input-container">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                    />
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <button onClick={handleCommentSubmit} disabled={loading}>
                        Submit Comment
                    </button>
                </div>
            ) : (
                <p>You must be logged in to post a comment.</p>
            )}
            {comments.map((comment) => (
                <div key={comment.id} className="comment">
                    <p>
                        <strong>{comment.userName}</strong>: {comment.text}
                    </p>
                    {comment.photoURL && <img src={comment.photoURL} alt="Comment attachment" />}
                </div>
            ))}
        </div>
    );
};

export default Comments;
