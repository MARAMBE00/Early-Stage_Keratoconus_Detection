import { collection, getDocs, addDoc, query, orderBy, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebaseConfig";
import { getAuth, signInAnonymously } from "firebase/auth";

const patientsCollection = collection(db, "patients");

// Function to get the last patient ID and increment
export const getNextPatientID = async () => {
  const q = query(patientsCollection, orderBy("idNumber", "desc"), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return "P2024001"; // First patient ID if no records exist
  } else {
    const lastPatient = snapshot.docs[0].data();
    const lastIDNumber = lastPatient.idNumber.replace("P", ""); // Remove "P"
    const newIDNumber = `P${(parseInt(lastIDNumber) + 1).toString().padStart(7, "0")}`;
    return newIDNumber;
  }
};

// Function to upload image to Firebase Storage
export const uploadPatientImage = async (file: File, patientID: string) => {
  try {
      const auth = getAuth();  // ✅ Get Firebase Auth instance
      let user = auth.currentUser;

      if (!user) {
          console.warn("User is not logged in. Attempting anonymous sign-in...");
          const userCredential = await signInAnonymously(auth); // ✅ Auto login anonymously
          user = userCredential.user;
      }

      if (!user) {
          throw new Error("Authentication failed! Cannot upload image.");
      }

      console.log("Uploading image to Firebase Storage...");
      const storageRef = ref(storage, `patient_images/${patientID}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("Image uploaded successfully:", downloadURL);
      return downloadURL;
  } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
  }
};

// Function to save patient data in Firestore
export const savePatientData = async (patientData: any) => {
    try {
      console.log("Saving patient data to Firestore:", patientData);
      await addDoc(patientsCollection, patientData);
      console.log("Patient data saved successfully!");
    } catch (error) {
      console.error("Error saving patient data:", error);
      throw error;
    }
  };