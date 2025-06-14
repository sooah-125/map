
    window.chtlConfig = { chatbotId: "7743599443" }
  

    const map = L.map('map', { attributionControl: false }).setView([37.6487780, 127.0643529], 16);

    const detailedTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    });

    const simpleTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; CartoDB'
    });

    simpleTile.addTo(map);
    let currentTile = simpleTile;

    document.getElementById("expand-view")?.addEventListener("click", () => {
      if (currentTile !== detailedTile) {
        map.removeLayer(currentTile);
        detailedTile.addTo(map);
        currentTile = detailedTile;
      }
    });

    document.getElementById("collapse-view")?.addEventListener("click", () => {
      if (currentTile !== simpleTile) {
        map.removeLayer(currentTile);
        simpleTile.addTo(map);
        currentTile = simpleTile;
      }
    });

    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const purpleIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    function createLabelIcon(text) {
      return L.divIcon({
        className: 'label-icon',
        html: `<div class="label-text">${text}</div>`,
        iconAnchor: [15, 0],
        popupAnchor: [0, -30]
      });
    }

    const allMarkers = [];
    const redMarkers = [];
    const purpleMarkers = [];
    const baseMarkers = [];
const spiderfiedLabels = new Set(); // [수정된 부분] 스파이더된 라벨 추적용
const spiderfiedClusters = new Set(); // [추가] 열린 클러스터 추적

    const markerClusterGroup = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });
    map.addLayer(markerClusterGroup);

    const duplicateMap = new Map();


 // [수정] 클러스터 펼침 시 텍스트도 위치 조정 (최대한 가까운 거리에서 겹치지 않도록 배치)
    markerClusterGroup.on('spiderfied', (e) => {
      const all = [...allMarkers, ...baseMarkers];
      const angleStep = (2 * Math.PI) / e.cluster.getChildCount();
      let angle = 0;

      e.cluster.getAllChildMarkers().forEach((marker, i) => {
        const entry = all.find(e => e.marker === marker);
        if (entry) {
          const latlng = marker.getLatLng();
          const offsetDistance = 0.00012; // 적당한 거리 유지
          const offsetLat = latlng.lat + Math.sin(angle) * offsetDistance;
          const offsetLng = latlng.lng + Math.cos(angle) * offsetDistance;
          entry.label.setLatLng([offsetLat, offsetLng]);
          angle += angleStep;
        }
      });
    });

    markerClusterGroup.on('unspiderfied', (e) => {
      const all = [...allMarkers, ...baseMarkers];
      e.cluster.getAllChildMarkers().forEach(marker => {
        const entry = all.find(e => e.marker === marker);
        if (entry) {
          const latlng = marker.getLatLng();
          entry.label.setLatLng(latlng);
        }
      });
    });

    markerClusterGroup.on('clusteringend', () => {
      const layers = markerClusterGroup.getLayers();
      if (layers.length > 0) {
        const group = new L.featureGroup(layers);
        map.fitBounds(group.getBounds().pad(0.2));
      }
    });

    function addMarkerWithLabel(lat, lng, labelText, popupText = '', icon = null, isBase = false, detailPage = null) {
      const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const marker = L.marker([lat, lng], icon ? { icon } : {});

      if (popupText) {
        marker.bindPopup(popupText);
      }

      marker.on('click', () => {
        const destinationLatLng = [lat, lng]; 
        if (detailPage) openIframe(detailPage);
        drawRealRouteToBase([lat, lng]);

        setTimeout(() => {
          const mapContainer = document.getElementById('map-container');
          const isHalfMap = mapContainer?.classList.contains('half-map');
          let offsetX = 0;
          if (isHalfMap) {
            offsetX = map.getSize().x * -0.25;
          }
          const point = map.latLngToContainerPoint(destinationLatLng);
          const centered = L.point(point.x - offsetX, point.y);
          const target = map.containerPointToLatLng(centered);
          map.setView(target, map.getZoom(), { animate: true });
        }, 300);
      });

      const label = L.marker([lat, lng], {
        icon: createLabelIcon(labelText),
        interactive: false,
        keyboard: false
      });

      if (!duplicateMap.has(coordKey)) {
        duplicateMap.set(coordKey, []);
      }
      duplicateMap.get(coordKey).push(marker);

      if (duplicateMap.get(coordKey).length > 1) {
        markerClusterGroup.addLayers(duplicateMap.get(coordKey));
      } else {
        map.addLayer(marker);
      }
      map.addLayer(label);

      const entry = { marker, label, icon };
      if (isBase) baseMarkers.push(entry);
      else allMarkers.push(entry);

      if (icon === redIcon) redMarkers.push(entry);
      else if (icon === purpleIcon) purpleMarkers.push(entry);

      return entry;
    }

    function showMarkersWithBase(extraMarkers) {
      const combined = [...baseMarkers, ...extraMarkers];

      markerClusterGroup.clearLayers();
      [...allMarkers, ...baseMarkers].forEach(({ marker, label }) => {
        map.removeLayer(marker);
        map.removeLayer(label);
      });

      combined.forEach(({ marker, label }) => {
        const latlng = marker.getLatLng();
        const coordKey = `${latlng.lat.toFixed(6)},${latlng.lng.toFixed(6)}`;
        if (duplicateMap.has(coordKey) && duplicateMap.get(coordKey).length > 1) {
          markerClusterGroup.addLayers(duplicateMap.get(coordKey));
        } else {
          map.addLayer(marker);
        }
        map.addLayer(label);
      });
    }

    document.getElementById("show-all-markers")?.addEventListener("click", () => {
      showMarkersWithBase(allMarkers);
    });
    document.getElementById("show-red-markers")?.addEventListener("click", () => {
      showMarkersWithBase(redMarkers);
    });
    document.getElementById("show-purple-markers")?.addEventListener("click", () => {
      showMarkersWithBase(purpleMarkers);
    });


      
    
    function showMarkersWithBase(extraMarkers) {
      const combined = [...baseMarkers, ...extraMarkers];

      // 전체 제거
      [...baseMarkers, ...allMarkers].forEach(({ marker, label }) => {
        map.removeLayer(marker);
        map.removeLayer(label);
      });

      // 다시 추가
      combined.forEach(({ marker, label }) => {
        marker.addTo(map);
        label.addTo(map);
      });
    }

// 항상 표시되는 마커
    addMarkerWithLabel(37.6487780, 127.0643529, '한국성서대학교', '한국성서대학교', greenIcon, true);
    addMarkerWithLabel(37.6562678, 127.0630304, '노원역', '노원역', null, true);
    addMarkerWithLabel(37.6448907, 127.0642467, '중계역', '중계역', null, true);

 // 분류되는 마커
addMarkerWithLabel(37.6495558747738, 127.062241988995, '권순옥김밥', '권순옥김밥', redIcon, false, "info.html?name=권순옥김밥");
addMarkerWithLabel(37.6502520069594, 127.062180018954, '시장풍경 국시집', '시장풍경 국시집', redIcon, false, "info.html?name=시장풍경 국시집");
addMarkerWithLabel(37.6495558747738, 127.062241988995, '노원수제비', '노원수제비', redIcon, false, "info.html?name=노원수제비");
addMarkerWithLabel(37.6561357418001, 127.063442617087, '니뽕내뽕 노원역점', '니뽕내뽕 노원역점', redIcon, false, "info.html?name=니뽕내뽕 노원역점");
addMarkerWithLabel(37.6557918268818, 127.062277905261, '롯데리아 노원역점', '롯데리아 노원역점', redIcon, false, "info.html?name=롯데리아 노원역점");
addMarkerWithLabel(37.6498808620377, 127.062236934343, '밀알생돈까스', '밀알생돈까스', redIcon, false, "info.html?name=밀알생돈까스");
addMarkerWithLabel(37.6502520069594, 127.062180018954, '별학골명품소머리국밥', '별학골명품소머리국밥', redIcon,false, "info.html?name=별학골명품소머리국밥");
addMarkerWithLabel(37.6552190449765, 127.063512438351, '샐러디 노원역점', '샐러디 노원역점', redIcon, false,"info.html?name=샐러디 노원역점");
addMarkerWithLabel(37.6500649811573, 127.061284207288, '수유리우동집 상계백병원점', '수유리우동집 상계백병원점', redIcon, false, "info.html?name=수유리우동집 상계백병원점");
addMarkerWithLabel(37.6479984188148, 127.062272983643, '슈엔차이 상계점', '슈엔차이 상계점', redIcon, false, "info.html?name=슈엔차이 상계점");
addMarkerWithLabel(37.6557918268818, 127.062277905261, '신미방마라탕 노원점', '신미방마라탕 노원점', redIcon, false,"info.html?name=신미방마라탕 노원점");
addMarkerWithLabel(37.6500649811573, 127.061284207288, '신화쭈꾸미 노원본점', '신화쭈꾸미 노원본점', redIcon, false, "info.html?name=신화쭈꾸미 노원본점");
addMarkerWithLabel(37.648494374797, 127.061997930473, '영성식당', '영성식당', redIcon, false, "info.html?name=영성식당");
addMarkerWithLabel(37.6495558747738, 127.062241988995, '죽이야기', '죽이야기', redIcon, false, "info.html?name=죽이야기");
addMarkerWithLabel(37.6546912567327, 127.059166814405, '포메인 노원점', '포메인 노원점', redIcon, false,"info.html?name=포메인 노원점");
addMarkerWithLabel(37.6533222020818, 127.05936970723, 'Poke all day 포케&샐러드 노원점', 'Poke all day 포케&샐러드 노원점', redIcon,false, "info.html?name=Poke all day 포케샐러드 노원점");
addMarkerWithLabel(37.6568911030589, 127.064972949542, '쩝스버거', '쩝스버거', redIcon,false, "info.html?name=쩝스버거");
addMarkerWithLabel(37.6527180726916, 127.061519941724, '피자스쿨 노원점', '피자스쿨 노원점', redIcon, false,"info.html?name=피자스쿨 노원점");
addMarkerWithLabel(37.6561357418001, 127.063442617087, '치히로 노원점', '치히로 노원점', redIcon, false, "info.html?name=치히로 노원점");
addMarkerWithLabel(37.6494212678049, 127.061555296287, '흥부솥뚜껑 생삼겹살 노원본점', '흥부솥뚜껑 생삼겹살 노원본점', redIcon, false, "info.html?name=흥부솥뚜껑 생삼겹살 노원본점");
addMarkerWithLabel(37.6495558747738, 127.062241988995, '노원고로케', '노원고로케', redIcon, false, "info.html?name=노원고로케");
addMarkerWithLabel(37.6495558747738, 127.062241988995, '명랑핫도그', '명랑핫도그', redIcon, false, "info.html?name=명랑핫도그");
addMarkerWithLabel(37.6492335099837, 127.062399341832, '컴포즈커피 상계백병원점', '컴포즈커피 상계백병원점', redIcon, false, "info.html?name=컴포즈커피 상계백병원점");

addMarkerWithLabel(37.5436079641311, 127.07041131957, '거북이 보드게임 카페', '거북이 보드게임 카페', purpleIcon, false, "info.html?name=거북이 보드게임 카페");
addMarkerWithLabel(37.5436079641311, 127.07041131957, '김호증모가발 리디아153 노원점', '김호증모가발 리디아153 노원점', purpleIcon, false, "info.html?name=김호증모가발 리디아153 노원점");
addMarkerWithLabel(37.6494044777358, 127.062302373264, '드랍더핏피티스튜디오', '드랍더핏피티스튜디오', purpleIcon, false, "info.html?name=드랍더핏피티스튜디오");
addMarkerWithLabel(37.6571079121252, 127.063254867375, '더메이즈 노원점', '더메이즈 노원점', purpleIcon, false, "info.html?name=더메이즈 노원점");
addMarkerWithLabel(37.6506100117206, 127.061234228831, '다비치 안경 노원상계백병원건너점', '다비치 안경 노원상계백병원건너점', purpleIcon,  false, "info.html?name=다비치 안경 노원상계백병원건너점");
addMarkerWithLabel(37.6504403325764, 127.061280549621, '디톤헤어 (구 제이빛 헤어)', '디톤헤어 (구 제이빛 헤어)', purpleIcon, false, "info.html?name=디톤헤어 (구 제이빛 헤어)");
addMarkerWithLabel(37.660676910032, 127.061495568943, '루프쉘하우스', '루프쉘하우스', purpleIcon, false, "info.html?name=루프쉘하우스");
addMarkerWithLabel(37.6459751467144, 127.064166413458, '빌리버짐 중계역점', '빌리버짐 중계역점', purpleIcon, false, "info.html?name=빌리버짐 중계역점");
addMarkerWithLabel(37.6505421411218, 127.06197526951, '생명의말씀사', '생명의말씀사', purpleIcon,false,  "info.html?name=생명의말씀사");
addMarkerWithLabel(37.6548752644222, 127.06192277535, '아이존팝', '아이존팝', purpleIcon, false, "info.html?name=아이존팝");
addMarkerWithLabel(37.6542725250696, 127.061716819928, '온 스터디 카페', '온 스터디 카페', purpleIcon, false, "info.html?name=온 스터디 카페");
addMarkerWithLabel(37.6538758836589, 127.061772133025, '오늘, 우리 사진관', '오늘, 우리 사진관', purpleIcon, false, "info.html?name=오늘, 우리 사진관");
addMarkerWithLabel(37.6552190449765, 127.063512438351, '알파 상계점', '알파 상계점', purpleIcon, false, "info.html?name=알파 상계점");
addMarkerWithLabel(37.6468094778429, 127.062619518352, '아프리카코인노래방', '아프리카코인노래방', purpleIcon, false, "info.html?name=아프리카코인노래방");
addMarkerWithLabel(37.6498808620377, 127.062236934343, '에이바헤어', '에이바헤어', purpleIcon, false, "info.html?name=에이바헤어");
addMarkerWithLabel(37.6563543249568, 127.062249590194, '조아코인노래방', '조아코인노래방', purpleIcon, false, "info.html?name=조아코인노래방");
addMarkerWithLabel(37.652229087473, 127.069966188528, '쿠방플러스', '쿠방플러스', purpleIcon, false, "info.html?name=쿠방플러스");
addMarkerWithLabel(37.6487051824451, 127.061869040263, '재이한의원', '재이한의원', purpleIcon, false, "info.html?name=재이한의원");
addMarkerWithLabel(37.6483312484445, 127.062089919265, '중계 필라테스 인', '중계 필라테스 인', purpleIcon, false, "info.html?name=중계 필라테스 인");
addMarkerWithLabel(37.6495558747738, 127.062241988995, '중계주짓수', '중계주짓수', purpleIcon, false, "info.html?name=중계주짓수");
addMarkerWithLabel(37.6509128734287, 127.061845828421, '핑퐁라이온스클럽', '핑퐁라이온스클럽', purpleIcon, false, "info.html?name=핑퐁라이온스클럽");
addMarkerWithLabel(37.6468094778429, 127.062619518352, '포포PC방', '포포PC방', purpleIcon, false, "info.html?name=포포PC방");
addMarkerWithLabel(37.6584150610173, 127.064412163475, '퍼퓸플레이', '퍼퓸플레이', purpleIcon, false, "info.html?name=퍼퓸플레이");
addMarkerWithLabel(37.6557918268818, 127.062277905261, '홈즈앤루팡 보드게임카페', '홈즈앤루팡 보드게임카페', purpleIcon, false, "info.html?name=홈즈앤루팡 보드게임카페");
addMarkerWithLabel(37.6561357418001, 127.063442617087, '휴식 노원1호점', '휴식 노원1호점', purpleIcon, false, "info.html?name=휴식 노원1호점");

 
  document.getElementById("show-all-markers").addEventListener("click", () => {
      showMarkersWithBase(allMarkers);
    });

    document.getElementById("show-red-markers").addEventListener("click", () => {
      showMarkersWithBase(redMarkers);
    });

    document.getElementById("show-purple-markers").addEventListener("click", () => {
      showMarkersWithBase(purpleMarkers);
    });

    map.on('zoomend', () => {
      const zoom = map.getZoom();
      const newSize = 12 + (zoom - 15) * 1.8;
      document.querySelectorAll('.label-text').forEach(label => {
        label.style.fontSize = `${newSize}px`;
      });
    });

    // 사이드 내비게이션
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


function openIframe(url) {
  const mapContainer = document.getElementById('map-container');
  const infoFrame = document.getElementById('infoFrame');
  mapContainer.classList.add('half-map');
  infoFrame.src = url;
  infoFrame.style.display = "block"; // ← 이 줄 추가!
}

function closeIframe() {
  const mapContainer = document.getElementById('map-container');
  const infoFrame = document.getElementById('infoFrame');
  mapContainer.classList.remove('half-map');
  infoFrame.src = '';
  infoFrame.style.display = "none"; // ← 이 줄 추가!
}


let currentRoute = null;

function drawRealRouteToBase(destinationLatLng) {
  
  const baseCoords = [127.0643529, 37.6487780];
  const destCoords = [destinationLatLng[1], destinationLatLng[0]];

  fetch("https://api.openrouteservice.org/v2/directions/foot-walking/geojson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "5b3ce3597851110001cf62481a5f204986714b06a851c1794e6ec7db"
    },
    body: JSON.stringify({
      coordinates: [baseCoords, destCoords]
    })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.features || data.features.length === 0) {
        alert("경로를 찾을 수 없습니다.");
        return;
      }

      if (currentRoute) map.removeLayer(currentRoute);

      currentRoute = L.geoJSON(data, {
        style: {
          color: '#4a90e2',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 6, 2, 6'
        }
      }).addTo(map);

      const summary = data.features[0].properties.summary;
      const distanceKm = (summary.distance / 1000).toFixed(2);
      const durationMin = Math.ceil(summary.duration / 60);

   L.popup({
  autoPan: false,
  
  closeOnClick: false,
  offset: [0, -20] // 필요시 미세한 위치 조정
})
.setLatLng(destinationLatLng)
.setContent(`<b>도보 거리:</b> ${distanceKm}km<br><b>예상 시간:</b> ${durationMin}분`)
.openOn(map);


    })
    .catch(err => {
      console.error("경로를 불러오지 못했습니다.", err);
      alert("경로 요청 중 오류가 발생했습니다.");
    });
}

function offsetLatLng(latlng, offsetX, offsetY) {
  // 지도에서 픽셀 좌표로 변환 → 오프셋 추가 → 지리 좌표로 재변환
  const point = map.latLngToContainerPoint(latlng);
  const newPoint = L.point(point.x + offsetX, point.y + offsetY);
  return map.containerPointToLatLng(newPoint);
}

  

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
// ✅ 로그인 확인 후 접근 제한 처리 /*
  const protectedPages = ["list_restourant.html","list_leisure.html", "map.html", "external.html", "ask.html","sitemap.html"];
  const currentPath = window.location.pathname.split("/").pop();
  if (!user && protectedPages.includes(currentPath)) {
    alert("로그인이 필요합니다.");
    window.location.href = "login.html";
  }
});





  // URL 파라미터로부터 `place` 값을 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const placeToFocus = urlParams.get('place');

  // 페이지 로드 이후에 마커 이름과 일치하는 마커를 찾아 클릭 이벤트 발생
  if (placeToFocus) {
    setTimeout(() => {
      const matchedMarker = allMarkers.find(({ marker }) => marker.getPopup()?.getContent() === placeToFocus);
      if (matchedMarker) {
        matchedMarker.marker.fire('click');
        map.setView(matchedMarker.marker.getLatLng(), 17); // 확대도 조정
      }
    }, 800); // 마커 로딩 이후 시점 보장 (약간의 딜레이 필요)
  }
