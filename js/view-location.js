import { db } from '../firebase-config.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Initializing Lucide Icons
lucide.createIcons();

// Parse URL query parameter
const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

const travelerUid = getUrlParam('uid');

if (!travelerUid) {
  showErrorState();
} else {
  // Establish Firestore real-time onSnapshot coordinate listener (READ / LISTEN operation)
  try {
    const docRef = doc(db, 'locations', travelerUid);
    onSnapshot(docRef, (docSnap) => {
      document.getElementById('loader-view').style.display = 'none';
      
      if (docSnap.exists() && docSnap.data().sharing === true) {
        const loc = docSnap.data();
        showActiveState(loc);
      } else {
        showOfflineState();
      }
    }, (error) => {
      showErrorState();
    });
  } catch (e) {
    showErrorState();
  }
}

function showActiveState(loc) {
  document.getElementById('error-view').style.display = 'none';
  document.getElementById('active-view').style.display = 'block';
  
  // Fill telemetry metrics
  document.getElementById('traveler-name').textContent = loc.name || 'Traveler';
  document.getElementById('lat-val').textContent = loc.latitude.toFixed(5);
  document.getElementById('lng-val').textContent = loc.longitude.toFixed(5);
  document.getElementById('accuracy-val').textContent = Math.round(loc.accuracy) + 'm';
  
  const timestamp = loc.updatedAt ? new Date(loc.updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString();
  document.getElementById('updated-val').textContent = timestamp;
  
  // Status indicator
  const badge = document.getElementById('status-badge');
  badge.className = 'status-badge active';
  badge.innerHTML = '<i data-lucide="wifi" style="width:14px; height:14px; display:inline;"></i> Active Stream';
  
  // Update Map Frame
  const mapFrame = document.getElementById('map-frame');
  mapFrame.src = `https://maps.google.com/maps?q=${loc.latitude},${loc.longitude}&z=15&output=embed`;
  mapFrame.style.display = 'block';
  
  lucide.createIcons();
}

function showOfflineState() {
  document.getElementById('active-view').style.display = 'none';
  document.getElementById('error-view').style.display = 'flex';
}

function showErrorState() {
  document.getElementById('loader-view').style.display = 'none';
  document.getElementById('active-view').style.display = 'none';
  document.getElementById('error-view').style.display = 'flex';
  document.querySelector('#error-view .error-title').textContent = 'Invalid tracking identifier';
  document.querySelector('#error-view .error-desc').textContent = 'The link has expired, is broken, or parses invalid traveler signatures. Request the traveler to generate a new coordinate telemetry link.';
}
