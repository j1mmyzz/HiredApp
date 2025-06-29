import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { StoredInterviewSession } from '@/components/InterviewSession';
import type { User } from 'firebase/auth';

type SessionToSave = Omit<StoredInterviewSession, 'id' | 'date'>;

export async function saveInterviewSession(user: User, sessionData: SessionToSave): Promise<string> {
    if (!db) throw new Error("Firestore is not initialized.");
    const docRef = await addDoc(collection(db, `users/${user.uid}/sessions`), {
        ...sessionData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getInterviewSessions(user: User): Promise<StoredInterviewSession[]> {
    if (!db) throw new Error("Firestore is not initialized.");
    const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
    const q = query(sessionsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const sessions: StoredInterviewSession[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString();
        sessions.push({
            id: doc.id,
            jobCategory: data.jobCategory,
            formattedJobCategory: data.formattedJobCategory,
            date: date,
            results: data.results,
        });
    });
    return sessions;
}

export async function clearInterviewHistory(user: User): Promise<void> {
    if (!db) throw new Error("Firestore is not initialized.");
    const sessionsCollection = collection(db, `users/${user.uid}/sessions`);
    const querySnapshot = await getDocs(sessionsCollection);
    
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    
    await batch.commit();
}
