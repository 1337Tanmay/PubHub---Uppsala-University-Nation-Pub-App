import { FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// This function now returns a Promise that resolves to the average rating
export default async function fetchRating(pubName) {
  const reviewsRef = collection(FIRESTORE_DB, 'Pubs', pubName, "Reviews");
  const querySnapshot = await getDocs(reviewsRef);
  const reviewsArray = querySnapshot.docs.map(doc => doc.data());

  if (reviewsArray.length > 0) {
    const totalRating = reviewsArray.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = totalRating / reviewsArray.length;
    return avgRating; // Return the average rating
  } else {
    return 0; // Return 0 if there are no reviews
  }
}