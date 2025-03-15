import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Reference to the "users" collection in Firestore
const usersCollection = collection(db, "users");

// Function to create a user in Firestore (IT will use this later)
export const createUser = async (username: string, password: string, role: string) => {
  const userDoc = doc(usersCollection, username);

  await setDoc(userDoc, {
    username,
    password,
    role
  });
};

// Function to validate user login credentials
// Function to validate user login credentials
export const validateUser = async (username: string, password: string, role: string) => {
  try {
    const userDoc = doc(usersCollection, username);
    const docSnap = await getDoc(userDoc);

    if (!docSnap.exists()) {
      console.error("User not found:", username);
      return null; // No user found
    }

    const userData = docSnap.data();
    console.log("Fetched user data:", userData);

    // Check if the password and role match
    if (userData.password === password && userData.role === role) {
      return userData; // Success
    } else {
      console.error("Invalid role or password for user:", username);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};