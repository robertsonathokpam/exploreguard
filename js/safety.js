import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initializing Lucide Icons
lucide.createIcons();

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = 'login.html';
});

// Local emergency contacts database by district
const contacts = {
  'imphal-east': [
    { icon: 'shield', title: 'Imphal East Police', num: '0385-2450900', note: 'District HQ Office', tel: '03852450900' },
    { icon: 'heart-pulse', title: 'JNIMS Hospital', num: '0385-2416041', note: 'Emergency Trauma 24/7', tel: '03852416041' },
    { icon: 'flame', title: 'Fire Station', num: '101', note: 'Imphal East Command', tel: '101' },
    { icon: 'compass', title: 'National Tourist Helpline', num: '1363', note: 'Govt. of India · 24/7 Support', tel: '1363' }
  ],
  'imphal-west': [
    { icon: 'shield', title: 'Imphal West Police', num: '0385-2220023', note: 'District HQ Office', tel: '03852220023' },
    { icon: 'heart-pulse', title: 'RIMS Hospital', num: '0385-2411700', note: 'Emergency Trauma 24/7', tel: '03852411700' },
    { icon: 'flame', title: 'Fire Station', num: '101', note: 'Imphal West Command', tel: '101' },
    { icon: 'compass', title: 'National Tourist Helpline', num: '1363', note: 'Govt. of India · 24/7 Support', tel: '1363' }
  ],
  'churachandpur': [
    { icon: 'shield', title: 'CCpur District Police', num: '03874-234567', note: 'District HQ Office', tel: '03874234567' },
    { icon: 'heart-pulse', title: 'District Hospital', num: '03874-234100', note: 'General Ward 24/7', tel: '03874234100' },
    { icon: 'flame', title: 'Fire Station', num: '101', note: 'Churachandpur Station', tel: '101' },
    { icon: 'compass', title: 'National Tourist Helpline', num: '1363', note: 'Govt. of India · 24/7 Support', tel: '1363' }
  ],
  'senapati': [
    { icon: 'shield', title: 'Senapati District Police', num: '03872-222345', note: 'District HQ Office', tel: '03872222345' },
    { icon: 'heart-pulse', title: 'District Hospital', num: '03872-222100', note: 'General Ward 24/7', tel: '0387222100' },
    { icon: 'flame', title: 'Fire Station', num: '101', note: 'Senapati Fire Depot', tel: '101' },
    { icon: 'compass', title: 'National Tourist Helpline', num: '1363', note: 'Govt. of India · 24/7 Support', tel: '1363' }
  ]
};

// Default contacts for districts without specific data
const defaultContacts = [
  { icon: 'shield', title: 'District Police', num: '100', note: 'National police network', tel: '100' },
  { icon: 'heart-pulse', title: 'Ambulance Response', num: '108', note: 'Free medical transit services', tel: '108' },
  { icon: 'flame', title: 'Fire Station', num: '101', note: 'Fire & emergency rescue', tel: '101' },
  { icon: 'compass', title: 'National Tourist Helpline', num: '1363', note: 'Govt. of India · 24/7 Support', tel: '1363' }
];

window.loadContacts = () => {
  const district = document.getElementById('district-select').value;
  const data = contacts[district] || defaultContacts;
  const grid = document.getElementById('contacts-grid');
  
  grid.innerHTML = data.map(c => `
    <div class="contact-card">
      <div class="contact-icon-box">
        <i data-lucide="${c.icon}"></i>
      </div>
      <div class="contact-info">
        <div class="contact-title">${c.title}</div>
        <div class="contact-num">${c.num}</div>
        <div class="contact-note">${c.note}</div>
        <a class="call-btn" href="tel:${c.tel}"><i data-lucide="phone" style="width:12px;"></i> Call Now</a>
      </div>
    </div>`).join('');
    lucide.createIcons();
};

loadContacts();
