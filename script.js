
  const firebaseConfig = {
    apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
    authDomain: "web-programing-6218e.firebaseapp.com",
    projectId: "web-programing-6218e",
    appId: "1:687421762824:web:be3d91a6c66d304a32d0bd"
  };
  firebase.initializeApp(firebaseConfig);
  // ✅ 전역에 명시적으로 선언 추가
let currentUser; // 또는 var currentUser;
  const auth = firebase.auth();

  
    
auth.onAuthStateChanged(user => {
  currentUser = user; // ✅ 전역 저장

  const signupBtn = document.querySelector(".signup");
  if (!signupBtn) return;

  const homeBtn = signupBtn.cloneNode(true);
  signupBtn.parentNode.replaceChild(homeBtn, signupBtn);

  if (user) {
    homeBtn.textContent = "Log out";
    homeBtn.onclick = () => {
      auth.signOut().then(() => location.reload());
    };
  } else {
    homeBtn.textContent = "Sign Up";
    homeBtn.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // ✅ 로그인 확인 후 접근 제한 처리
  const protectedPages = ["list_restourant.html","list_leisure.html", "map.html", "external.html", "ask.html","sitemap.html"];
  const currentPath = window.location.pathname.split("/").pop();
  if (!user && protectedPages.includes(currentPath)) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
  }
});






  


  const hamburgerBtn = document.querySelector(".nav-buttons button[id='hamburger-btn']") || document.querySelector(".nav-buttons button:contains('☰')");
  const sideNav = document.getElementById("side-nav");
  const closeBtn = document.querySelector("#side-nav .close-btn");
  const overlay = document.getElementById("overlay");
  const sideListBtn = document.getElementById("side-list-btn");
  const sideListSubmenu = document.getElementById("side-list-submenu");

  hamburgerBtn?.addEventListener("click", () => {
    sideNav.classList.add("open");
    overlay.classList.add("active");
  });

  closeBtn?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  overlay?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  sideListBtn?.addEventListener("click", () => {
    const isOpen = sideListSubmenu.style.display === "flex";
    sideListSubmenu.style.display = isOpen ? "none" : "flex";
    sideListBtn.textContent = isOpen ? "리스트로 보기 ⏷" : "리스트로 보기 ⏶";
    sideListBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });


  const hamburgerBtn = document.querySelector(".nav-buttons button[id='hamburger-btn']") || document.querySelector(".nav-buttons button:contains('☰')");
  const sideNav = document.getElementById("side-nav");
  const closeBtn = document.querySelector("#side-nav .close-btn");
  const overlay = document.getElementById("overlay");
  const sideListBtn = document.getElementById("side-list-btn");
  const sideListSubmenu = document.getElementById("side-list-submenu");

  hamburgerBtn?.addEventListener("click", () => {
    sideNav.classList.add("open");
    overlay.classList.add("active");
  });

  closeBtn?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  overlay?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  sideListBtn?.addEventListener("click", () => {
    const isOpen = sideListSubmenu.style.display === "flex";
    sideListSubmenu.style.display = isOpen ? "none" : "flex";
    sideListBtn.textContent = isOpen ? "리스트로 보기 ⏷" : "리스트로 보기 ⏶";
    sideListBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });


  const firebaseConfig = {
    apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
    authDomain: "web-programing-6218e.firebaseapp.com",
    projectId: "web-programing-6218e",
    appId: "1:687421762824:web:be3d91a6c66d304a32d0bd"
  };
  firebase.initializeApp(firebaseConfig);
  // ✅ 전역에 명시적으로 선언 추가
let currentUser; // 또는 var currentUser;
  const auth = firebase.auth();

  
    
auth.onAuthStateChanged(user => {
  currentUser = user; // ✅ 전역 저장

  const signupBtn = document.querySelector(".signup");
  if (!signupBtn) return;

  const homeBtn = signupBtn.cloneNode(true);
  signupBtn.parentNode.replaceChild(homeBtn, signupBtn);

  if (user) {
    homeBtn.textContent = "Log out";
    homeBtn.onclick = () => {
      auth.signOut().then(() => location.reload());
    };
  } else {
    homeBtn.textContent = "Sign Up";
    homeBtn.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // ✅ 로그인 확인 후 접근 제한 처리
  const protectedPages = ["list_restourant.html", "map.html", "partner.html"];
  const currentPath = window.location.pathname.split("/").pop();
  if (!user && protectedPages.includes(currentPath)) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
  }
});






  


    const firebaseConfig = {
      apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
      authDomain: "web-programing-6218e.firebaseapp.com",
      projectId: "web-programing-6218e",
      appId: "1:687421762824:web:be3d91a6c66d304a32d0bd"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    function showSignup() {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("signup-section").style.display = "block";
    }

    function showLogin() {
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("login-section").style.display = "block";
    }

    document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (!email.endsWith("@bible.ac.kr")) {
        document.getElementById("login-error").textContent = "학교 이메일만 허용됩니다.";
        return;
      }

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          alert("로그인 성공! 홈페이지로 이동합니다.");
          window.location.href = "index.html";
        })
        .catch((error) => {
          document.getElementById("login-error").textContent = "로그인 실패: " + error.message;
        });
    });

    document.getElementById("signup-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      if (!email.endsWith("@bible.ac.kr")) {
        document.getElementById("signup-message").textContent = "학교 이메일만 허용됩니다.";
        return;
      }

      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          document.getElementById("signup-message").className = "success-message";
          document.getElementById("signup-message").textContent = "회원가입 완료! 로그인해주세요.";
          document.getElementById("signup-form").reset();
        })
        .catch((error) => {
          document.getElementById("signup-message").className = "error-message";
          document.getElementById("signup-message").textContent = "회원가입 실패: " + error.message;
        });
    });
  

auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = "index.html";
  }
});
 

  const hamburgerBtn = document.querySelector(".nav-buttons button[id='hamburger-btn']") || document.querySelector(".nav-buttons button:contains('☰')");
  const sideNav = document.getElementById("side-nav");
  const closeBtn = document.querySelector("#side-nav .close-btn");
  const overlay = document.getElementById("overlay");
  const sideListBtn = document.getElementById("side-list-btn");
  const sideListSubmenu = document.getElementById("side-list-submenu");

  hamburgerBtn?.addEventListener("click", () => {
    sideNav.classList.add("open");
    overlay.classList.add("active");
  });

  closeBtn?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  overlay?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  sideListBtn?.addEventListener("click", () => {
    const isOpen = sideListSubmenu.style.display === "flex";
    sideListSubmenu.style.display = isOpen ? "none" : "flex";
    sideListBtn.textContent = isOpen ? "리스트로 보기 ⏷" : "리스트로 보기 ⏶";
    sideListBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });


  const firebaseConfig = {
    apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
    authDomain: "web-programing-6218e.firebaseapp.com",
    projectId: "web-programing-6218e",
    appId: "1:687421762824:web:be3d91a6c66d304a32d0bd"
  };
  firebase.initializeApp(firebaseConfig);
  // ✅ 전역에 명시적으로 선언 추가
let currentUser; // 또는 var currentUser;
  const auth = firebase.auth();

  
    
auth.onAuthStateChanged(user => {
  currentUser = user; // ✅ 전역 저장

  const signupBtn = document.querySelector(".signup");
  if (!signupBtn) return;

  const homeBtn = signupBtn.cloneNode(true);
  signupBtn.parentNode.replaceChild(homeBtn, signupBtn);

  if (user) {
    homeBtn.textContent = "Log out";
    newBtn.onclick = () => {
      auth.signOut().then(() => location.reload());
    };
  } else {
    homeBtn.textContent = "Sign Up";
    homeBtn.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // ✅ 로그인 확인 후 접근 제한 처리
  const protectedPages = ["list_restourant.html","list_leisure.html", "map.html", "external.html", "ask.html","sitemap.html"];
  const currentPath = window.location.pathname.split("/").pop();
  if (!user && protectedPages.includes(currentPath)) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
  }
});






  

 
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sideNav = document.getElementById("side-nav");
    const closeBtn = document.querySelector("#side-nav .close-btn");
    const overlay = document.getElementById("overlay");

    hamburgerBtn.addEventListener("click", () => {
      sideNav.classList.add("open");
      overlay.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
      sideNav.classList.remove("open");
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", () => {
      sideNav.classList.remove("open");
      overlay.classList.remove("active");
    });

    const sideListBtn = document.getElementById("side-list-btn");
    const sideListSubmenu = document.getElementById("side-list-submenu");

    sideListBtn.addEventListener("click", () => {
      const isOpen = sideListSubmenu.style.display === "flex";
      if (isOpen) {
        sideListSubmenu.style.display = "none";
        sideListBtn.textContent = "리스트로 보기 ⏷";
        sideListBtn.setAttribute("aria-expanded", "false");
      } else {
        sideListSubmenu.style.display = "flex";
        sideListBtn.textContent = "리스트로 보기 ⏶";
        sideListBtn.setAttribute("aria-expanded", "true");
      }
    });
  

    // Firebase 설정
    const firebaseConfig = {
      apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
      authDomain: "web-programing-6218e.firebaseapp.com",
      projectId: "web-programing-6218e"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // 문서 로드 후 실행
    window.addEventListener('DOMContentLoaded', () => {
      const inquiryList = document.getElementById("inquiryList");

      db.collection("문의")
        .orderBy("timestamp", "desc")
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            inquiryList.innerHTML = "<p>아직 문의가 없습니다.</p>";
            return;
          }

          inquiryList.innerHTML = snapshot.docs.map(doc => {
            const d = doc.data();
            const date = d.timestamp?.toDate?.().toLocaleString?.() || '';
            return `
              <div class="inquiry-item">
                <h3>${d.subject}</h3>
                <p>${d.message}</p>
                <small>${maskEmail(d.email || '')}</small>
                <small>${date}</small>
              </div>
            `;
          }).join("");
        })
        .catch(err => {
          console.error("문의 불러오기 오류:", err);
          inquiryList.innerHTML = "<p>불러오는 중 오류가 발생했습니다.</p>";
        });
    });
    
  

  function maskEmail(email) {
    if (!email.includes("@")) return email;
    const [user, domain] = email.split("@");
    const visible = user.slice(0, 2);
    const hidden = "*".repeat(Math.max(user.length - 2, 3));
    return `${visible}${hidden}@${domain}`;
  }

 

  const auth = firebase.auth();
  let currentUser;

  auth.onAuthStateChanged(user => {
    currentUser = user;

    const signupBtn = document.querySelector(".signup");
    if (!signupBtn) return;

    const newBtn = signupBtn.cloneNode(true);
    signupBtn.parentNode.replaceChild(newBtn, signupBtn);

    if (user) {
      newBtn.textContent = "Log out";
      newBtn.onclick = () => {
        auth.signOut().then(() => location.reload());
      };
    } else {
      newBtn.textContent = "Sign Up";
      newBtn.onclick = () => {
        window.location.href = "login.html";
      };
    }

    // ✅ 로그인 확인 후 접근 제한 처리
    const protectedPages = ["list_restourant.html", "map.html", "partner.html", "external.html", "sitemap.html", "ask.html"];
    const currentPath = window.location.pathname.split("/").pop();
    if (!user && protectedPages.includes(currentPath)) {
      alert("로그인이 필요합니다.");
      window.location.href = "login.html";
    }
  });



  const hamburgerBtn = document.querySelector(".nav-buttons button[id='hamburger-btn']") || document.querySelector(".nav-buttons button:contains('☰')");
  const sideNav = document.getElementById("side-nav");
  const closeBtn = document.querySelector("#side-nav .close-btn");
  const overlay = document.getElementById("overlay");
  const sideListBtn = document.getElementById("side-list-btn");
  const sideListSubmenu = document.getElementById("side-list-submenu");

  hamburgerBtn?.addEventListener("click", () => {
    sideNav.classList.add("open");
    overlay.classList.add("active");
  });

  closeBtn?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  overlay?.addEventListener("click", () => {
    sideNav.classList.remove("open");
    overlay.classList.remove("active");
  });

  sideListBtn?.addEventListener("click", () => {
    const isOpen = sideListSubmenu.style.display === "flex";
    sideListSubmenu.style.display = isOpen ? "none" : "flex";
    sideListBtn.textContent = isOpen ? "리스트로 보기 ⏷" : "리스트로 보기 ⏶";
    sideListBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });


  const firebaseConfig = {
    apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
    authDomain: "web-programing-6218e.firebaseapp.com",
    projectId: "web-programing-6218e",
    appId: "1:687421762824:web:be3d91a6c66d304a32d0bd"
  };
  firebase.initializeApp(firebaseConfig);
  // ✅ 전역에 명시적으로 선언 추가
let currentUser; // 또는 var currentUser;
  const auth = firebase.auth();

  
    
auth.onAuthStateChanged(user => {
  currentUser = user; // ✅ 전역 저장

  const signupBtn = document.querySelector(".signup");
  if (!signupBtn) return;

  const homeBtn = signupBtn.cloneNode(true);
  signupBtn.parentNode.replaceChild(homeBtn, signupBtn);

  if (user) {
    homeBtn.textContent = "Log out";
    homeBtn.onclick = () => {
      auth.signOut().then(() => location.reload());
    };
  } else {
    homeBtn.textContent = "Sign Up";
    homeBtn.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // ✅ 로그인 확인 후 접근 제한 처리
  const protectedPages = ["list_restourant.html","list_leisure.html", "map.html", "external.html", "ask.html","sitemap.html"];
  const currentPath = window.location.pathname.split("/").pop();
  if (!user && protectedPages.includes(currentPath)) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
  }
});






  

 
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sideNav = document.getElementById("side-nav");
    const closeBtn = document.querySelector("#side-nav .close-btn");
    const overlay = document.getElementById("overlay");

    hamburgerBtn.addEventListener("click", () => {
      sideNav.classList.add("open");
      overlay.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
      sideNav.classList.remove("open");
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", () => {
      sideNav.classList.remove("open");
      overlay.classList.remove("active");
    });

    const sideListBtn = document.getElementById("side-list-btn");
    const sideListSubmenu = document.getElementById("side-list-submenu");

    sideListBtn.addEventListener("click", () => {
      const isOpen = sideListSubmenu.style.display === "flex";
      if (isOpen) {
        sideListSubmenu.style.display = "none";
        sideListBtn.textContent = "리스트로 보기 ⏷";
        sideListBtn.setAttribute("aria-expanded", "false");
      } else {
        sideListSubmenu.style.display = "flex";
        sideListBtn.textContent = "리스트로 보기 ⏶";
        sideListBtn.setAttribute("aria-expanded", "true");
      }
    });
  

  // Firebase 초기화
  const firebaseConfig = {
    apiKey: "AIzaSyD-itP2Il2kZYzm-4BXL5wXXphp5gnTN3U",
    authDomain: "web-programing-6218e.firebaseapp.com",
    projectId: "web-programing-6218e"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // 폼 제출 처리
  document.getElementById("inquiryForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("status");

    if (!subject || !message) {
      status.textContent = "제목과 내용을 모두 입력해주세요.";
      status.style.color = "red";
      return;
    }

        try {
      await db.collection("문의").add({
        subject,
        message,
        email: window.userEmail || "unknown",
        timestamp: new Date()
      });
      status.textContent = "문의가 성공적으로 제출되었습니다!";
      status.style.color = "green";
      document.getElementById("inquiryForm").reset();

      setTimeout(() => {
        window.location.href = "ask.html"; 
      }, 2000);
    } catch (error) {
      console.error("문의 제출 오류:", error);
      status.textContent = "오류가 발생했습니다. 다시 시도해주세요.";
      status.style.color = "red";
    }
  }); 


  const auth = firebase.auth();
  auth.onAuthStateChanged(user => {
    const signupBtn = document.querySelector(".signup");
    const newBtn = signupBtn.cloneNode(true);
    signupBtn.parentNode.replaceChild(newBtn, signupBtn);
    
    if (user) {
      newBtn.textContent = "Log out";
      newBtn.onclick = () => {
        auth.signOut().then(() => location.reload());
      };
      window.userEmail = user.email;
    } else {
      newBtn.textContent = "Sign Up";
      newBtn.onclick = () => {
        window.location.href = "login.html";
      };
    }
  });


auth.onAuthStateChanged(user => {
  currentUser = user; // ✅ 전역 저장

  const signupBtn = document.querySelector(".signup");
  if (!signupBtn) return;

  const homeBtn = signupBtn.cloneNode(true);
  signupBtn.parentNode.replaceChild(homeBtn, signupBtn);

  if (user) {
    homeBtn.textContent = "Log out";
    homeBtn.onclick = () => {
      auth.signOut().then(() => location.reload());
    };
  } else {
    homeBtn.textContent = "Sign Up";
    homeBtn.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // ✅ 로그인 확인 후 접근 제한 처리
  const protectedPages = ["list_restourant.html", "map.html", "partner.html"];
  const currentPath = window.location.pathname.split("/").pop();
  if (!user && protectedPages.includes(currentPath)) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
  }
});
