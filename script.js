// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt-3xPszDlyQlIOw2fcyyVC5KnsuWkP3Y",
  authDomain: "flip-vedio.firebaseapp.com",
  databaseURL: "https://flip-vedio-default-rtdb.firebaseio.com",
  projectId: "flip-vedio",
  storageBucket: "flip-vedio.appspot.com",
  messagingSenderId: "683500498033",
  appId: "1:683500498033:web:898ff89cb9c0bbb4b4ffd0",
  measurementId: "G-TGELEK88XN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Function to handle the form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();

  const email = registrationForm.email.value;
  const password = registrationForm.password.value;

  try {
    // Check if the user already exists
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    const currentUserUid = userCredential.user.uid;

    // Upload profile photo to Firebase Storage
    const avatarFile = registrationForm.avatar.files[0];
    if (avatarFile) {
      const storage = getStorage();
      const avatarRef = storageRef(storage, `avatars/${currentUserUid}/${avatarFile.name}`);
      await uploadBytes(avatarRef, avatarFile);

      // Get the download URL of the uploaded avatar
      const avatarURL = await getDownloadURL(avatarRef);

      // User registration data
      const map = {
        yourname: registrationForm.yourname.value,
        username: registrationForm.username.value,
        email: email,
        uid: currentUserUid,
        avatar: avatarURL,
        bio: registrationForm.bio.value,
        gender: registrationForm.gender.value,
        age: registrationForm.age.value,
        verify: 'false',
        blocked: 'false',
        story: 'false',
        online: 'true',
        account_mode: 'free',
        join_date: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        hide_gender: 'true',
        hide_age: 'true',
        hide_status: 'false',
      };

      const udb = getDatabase();
      await update(ref(udb, `users/${currentUserUid}`), map);

      alert('Registration successful!');
      registrationForm.reset();
    } else {
      alert('Please select a profile photo.');
    }
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Registration failed: Email address is already in use.');
    } else {
      alert('Registration failed: ' + error.message);
    }
  }
};

// Add event listener for form submission
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', handleFormSubmit);
