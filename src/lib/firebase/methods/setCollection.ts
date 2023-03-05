import { projectFirestore, timestamp } from '../config';
import uniqid from 'uniqid';

export const setCollection = () => {
  const addDocWithID = async (
    collection: string,
    subCollection: string,
    doc: any,
    userID: string | undefined,
  ) => {
    try {
      const res = await projectFirestore
        .collection(collection)
        .doc(userID)
        .collection(subCollection)
        .doc(uniqid())
        .set({
          ...doc,
          createdAt: timestamp(),
          seen: false,
        });
    } catch (err) {
      console.log(err);
    }
  };

  const updateSeenMessageField = async (
    collection: string,
    subCollection: string,
    userID: string | undefined,
    id: string | undefined,
  ) => {
    try {
      await projectFirestore
        .collection(collection)
        .doc(userID)
        .collection(subCollection)
        .doc(id)
        .update({
          seen: true,
        });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    addDocWithID,
    updateSeenMessageField,
  };
};
