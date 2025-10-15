// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, logEvent, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
  authDomain: "web-programing-6218e.firebaseapp.com",
  projectId: "web-programing-6218e",
  storageBucket: "web-programing-6218e.firebasestorage.app",
  messagingSenderId: "687421762824",
  appId: "1:687421762824:web:be3d91a6c66d304a32d0bd",
  measurementId: "G-00Y72N5646"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 메일 인증 링크 설정
const actionCodeSettings = {
  url: "https://sooah-125.github.io/map/login.html",
  handleCodeInApp: false,
};


isSupported()
  .then(ok => {
    if (!ok) return;
    const analytics = getAnalytics(app);
    logEvent(analytics, "page_view", { page_path: location.pathname });
  })
  .catch(e => console.warn("Analytics not initialized:", e?.message || e));

// Auth 유틸
export async function signUpWithEmailVerification(email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(user, actionCodeSettings);
  alert("인증 메일을 보냈습니다. 스팸함 포함 확인 후 인증하세요.");
  await signOut(auth);
}

export async function signInRequireVerified(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  if (!user.emailVerified) {
    if (confirm("이메일 인증이 필요합니다. 인증 메일을 다시 보낼까요?")) {
      await sendEmailVerification(user, actionCodeSettings);
      alert("인증 메일을 다시 보냈습니다.");
    }
    throw new Error("EMAIL_NOT_VERIFIED");
  }
  return user;
}

export function guardRequireAuth(redirectTo = "login.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      location.href = redirectTo;
    }
  });
}

export function guardRequireVerifiedAuth(redirectTo = "login.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      location.href = redirectTo;
      return;
    }
    if (!user.emailVerified) {
      alert("이메일 인증이 필요합니다.");
      location.href = redirectTo;
    }
  });
}


export { app, auth, db };
