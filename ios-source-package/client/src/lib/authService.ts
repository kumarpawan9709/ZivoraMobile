import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  User,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthService {
  // Convert Firebase User to our AuthUser interface
  private mapFirebaseUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  }

  // Email/Password Sign In
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return this.mapFirebaseUser(userCredential.user);
  }

  // Email/Password Sign Up
  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return this.mapFirebaseUser(userCredential.user);
  }

  // Google Sign In
  async signInWithGoogle(): Promise<AuthUser> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return this.mapFirebaseUser(userCredential.user);
  }

  // Sign Out
  async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Get current user as AuthUser
  getCurrentAuthUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.mapFirebaseUser(user) : null;
  }

  // Get ID Token
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  }

  // Auth state observer
  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.mapFirebaseUser(user) : null);
    });
  }
}

export const authService = new AuthService();