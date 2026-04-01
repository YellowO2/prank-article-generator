import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { Article } from "./models/article";

export async function findArticleBySlug(slug: string): Promise<Article | null> {
  const pranksRef = collection(db, "april-fools");
  const q = query(pranksRef, where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return {
    ...(doc.data() as Article),
  };
}

//increment
export async function incrementViewCount(slug: string): Promise<void> {
  const pranksRef = collection(db, "april-fools");
  const q = query(pranksRef, where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    await updateDoc(doc.ref, {
      views: (doc.data().views || 0) + 1,
    });
  }
}

export async function saveArticle(prank: Article): Promise<string> {
  const pranksRef = collection(db, "april-fools"); // Changed from "pranks" to "april-fools"
  const docRef = await addDoc(pranksRef, {
    ...prank,
  });
  return docRef.id;
}

export async function getTopArticles(
  limitCount: number = 100,
): Promise<Article[]> {
  const pranksRef = collection(db, "april-fools");
  const q = query(pranksRef, orderBy("views", "desc"), limit(limitCount));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data() as Article);
}
