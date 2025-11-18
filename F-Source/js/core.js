import  pingAllServers  from './FPing/Functions/Fortnite/Servers/servers.js';
import  startPingInterval  from './FPing/Functions//Fortnite/Servers/ping.js';
import  getFortniteStatus  from './FPing/Functions//Fortnite/Status/status.js';
import  fetchAndDisplayShop  from './FPing/Functions//Fortnite/Shop/shopv2.js';


    
    
       
    
    // --- APP STATE & CONFIG ---
    let appSettings = {};
    let translations = {};
    let pingIntervalId = null;
    const appVersion = '2.2.2';
  
    // ICONS

    const ICONS = {
        home: '<img src="./imgs/icons/home.png">',
         lan: '<img src="./imgs/icons/theme.png">',
         shop:       '<img src="./imgs/icons/shop.png">',
        servers: '<img src="./imgs/icons/servers.png">',
        settings: '<img src="./imgs/icons/settings.png">',
        wifi:   '<img src="./imgs/icons/wif50.png">',
        updt:   '<img src="./imgs/icons/icons8-update.svg">',
    };

    // HTML elements
    const mainAppScreen = document.getElementById('main-app-screen');
    const setupModal = document.getElementById('setup-screen-modal');
    const finishSetupBtn = document.getElementById('discord-login-btn');
        const offline = document.getElementById('guess-btn');
        const sidebar = document.getElementById('sidebar');
     const userpfp = document.getElementById('prfo');
    const wcm = document.getElementById('welcome_message')
    const sidebarProfileName = document.getElementById('sidebar-username');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    const iconsse = document.getElementById('icons-select');
    const serverListContainer = document.getElementById('server-list-container');
    const languageSelect = document.getElementById('language-select');
    const themeSwatches = document.querySelectorAll('.theme-swatch');
    const UserS = document.getElementById('UserSName');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const startupCheckbox = document.getElementById('startup-checkbox');
    const resetAppBtn = document.getElementById('reset-app-btn');
    const refreshPingsBtn = document.getElementById('refresh-pings-btn');
    const pingIntervalSelect = document.getElementById('ping-interval-select');

   // Settings

    // played uno for 3 hours straight omgggg im done
    // discord login stuff

    const username = localStorage.getItem('discordUsername');
    const userPfp = localStorage.getItem('discordPfp');



    /// Load

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('appSettings')) || {};
        appSettings = {
            username: settings.username || null,
            theme: settings.theme || 'dark',
            language: settings.language || 'en',
            pingInterval: settings.pingInterval || 10000,
            sideicons : settings.sideicons || 'cla',
            startup: settings.startup || false
        };
    }

    /// Save

    function saveSettings() {
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
    }


    // --- INITIALIZATION ---
    async function initialize() {
        loadSettings();
        await loadLanguage(appSettings.language);
        
        updateUIFromSettings();

        if (username && userPfp) {
            mainAppScreen.style.visibility = 'visible';
        
            setupModal.style.display = 'none';
            document.getElementById('VApp').innerText = `Version: ${appVersion}`;
            getFortniteStatus();
            fetchAndDisplayShop();
            pingAllServers();
            startPingInterval();
        } else {
            document.getElementById('VApp').innerText = `Version: ${appVersion}`;

            mainAppScreen.style.visibility = 'hidden';
            setupModal.style.display = 'flex';
         //   document.querySelector('.theme-swatch[data-theme="dark"]').classList.add('active'); // Default active swatch in setup
        }
        addNavEventListeners();
    }
    
    /// UI Building & Updating

    function updateUIFromSettings() {

        document.documentElement.setAttribute('data-theme', appSettings.theme);
        iconsse.value = appSettings.sideicons;
        languageSelect.value = appSettings.language;
      //  sideicons.value = appSettings.sideicons;
        pingIntervalSelect.value = appSettings.pingInterval;
        startupCheckbox.checked = appSettings.startup;


         // welcome thing 
  
        // welcome messages

           const phrases = [
            "Welcome back,",
            "Hello again,",
            "Greetings,",  
            "Good to see you,",
            "Hey there,",
            "Welcome aboard,",
            "Nice to have you back,",
            "Glad you're here,",
            "Welcome to the app,",
            "It's great to see you,",
            "Welcome, ",
            "Hey there,",
            "Hello,",
            "Hi there,",

            
        ];



            const randomIndex = Math.floor(Math.random() * phrases.length);
          
            const randomPhrase = phrases[randomIndex];
            UserS.textContent = username;
            


         sidebarProfileName.textContent = username;
        wcm.textContent = 'Welcome!';
        
    }


    /// Home Changing Background

    const backgrounds = [
        'url("./imgs/backgrounds/tilted.jpg")',
        'url("./imgs/backgrounds/tiltedup.jpg")',
        'url("./imgs/backgrounds/samu.jpg")',
        'url("./imgs/backgrounds/bri.jpg")',
        'url("https://primagames.com/wp-content/uploads/2025/11/lard-lad-donuts-fortnite.jpg?w=1200")',
        'url("https://insider-gaming.com/wp-content/uploads/2025/11/The-Simpsons-House-Fortnite-scaled.jpg")',

    ]

    function changeBackground() {
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        document.body.style.backgroundImage = backgrounds[randomIndex];
    }
    changeBackground();
    setInterval(changeBackground, 60000); 


    
    /// Building Sidebar & functionality


    async function buildSidebar(type) {

        try {

        if (type) appSettings.sideicons = type;
        saveSettings();


        if (appSettings.sideicons === 'cla') {
       
   const logoo = document.getElementById('logoo');
            logoo.src = './imgs/logo.png'
            logoo.alt = 'logo'
            const fnstatusspn = document.getElementById('fnstatusspn');
            fnstatusspn.textContent = 'FNStatus :'
            const thidk = document.getElementById('thidk');
            sidebar.style.width = '240px';
            const sidepro = document.getElementById('sidepro');
            sidepro.classList.remove('proexpand');
             document.querySelector('.sidebar ul').innerHTML = `
            <li style="cursor : pointer;"><a href="#" class="nav-link active" data-page="home">${ICONS.home}<span data-i18n="home">${translations.home || 'Home'}</span></a></li>
              <li style="cursor : pointer;"><a href="#" class="nav-link" data-page="shop">${ICONS.shop}<span data-i18n="shop">${translations.shop || 'Shop'}</span></a></li>
            <li style="cursor : pointer;"><a href="#" class="nav-link" data-page="servers">${ICONS.servers}<span data-i18n="servers">${translations.servers || 'Servers'}</span></a></li>
            <li style="cursor : pointer;"><a href="#" class="nav-link" data-page="settings">${ICONS.settings}<span data-i18n="settings">${translations.settings || 'Settings'}</span></a></li>
        `;

        }

        else if (appSettings.sideicons === 'com') {
            

            const logoo = document.getElementById('logoo');
            logoo.src = ''
            logoo.alt = ''
            
            const fnstatusspn = document.getElementById('fnstatusspn');
            const thidk = document.getElementById('thidk');
            const sidepro = document.getElementById('sidepro');
            sidepro.classList.add('proexpand');



             document.querySelector('.sidebar ul').innerHTML = `
            <li  style="width : 50px; cursor : pointer;"><a href="#" style="color : transparent;" class="nav-link active"" data-page="home">${ICONS.home}<span data-i18n="home">${translations.home || 'Home'}</span></a></li>
              <li style="width : 50px; cursor : pointer;"><a style="color : transparent; href="#" class="nav-link" data-page="shop">${ICONS.shop}<span data-i18n="shop">${translations.shop || 'Shop'}</span></a></li>
            <li style="width : 50px; cursor : pointer;"><a style="color : transparent; href="#" class="nav-link" data-page="servers">${ICONS.servers}<span data-i18n="servers">${translations.servers || 'Servers'}</span></a></li>
            <li style="width : 50px; cursor : pointer;"><a style="color : transparent; href="#" class="nav-link" data-page="settings">${ICONS.settings}<span data-i18n="settings">${translations.settings || 'Settings'}</span></a></li>
        `;

        }

        addNavEventListeners(); 
        } catch (error) { console.error("Error building sidebar:", error); }
    }

    // Server Pinging 
    
  

  
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`./data/lang/${lang}.json`);
            translations = await response.json();
            appSettings.language = lang;
            buildSidebar();
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (translations[key]) el.textContent = translations[key];
            });
            updateUIFromSettings(); 
        } catch (error) {`internal error (dontmind) : ${error}`}
    }

    

    // --- EVENT LISTENERS ---
    function addNavEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.dataset.page;
                document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
                document.querySelectorAll('.page-content').forEach(page => {
                    page.classList.toggle('active', page.id === `${pageId}-page`);
                    document.getElementById('headerdisplaylabel').textContent = link.querySelector('span').textContent;
                    document.getElementById('headerdisplayimg').src = link.querySelector('img').src;
                });
            });
        });
    }




   
        function showNotification(type, title, message) {
            const container = document.getElementById('notification-container');
            if (!container) {
                console.error('Notification container not found!');
                return;
            }

 
            const notification = document.createElement('div');

            notification.className = `notification ${type} notification-enter`;

            notification.innerHTML = `
                <div class="notification-icon">
                    ${getNotificationIcon(type)}
                </div>
                <div class="notification-content">
                    <p class="notification-title">${title}</p>
                    <p class="notification-message">${message}</p>
                </div>
                <button onclick="dismissNotification(this)" class="notification-close-btn">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="width:20px; height:20px;">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;

         
            container.appendChild(notification);

            setTimeout(() => {
      
                const closeButton = notification.querySelector('.notification-close-btn');
                if (closeButton) {
                    dismissNotification(closeButton);
                }
            }, 5000);
        }

        function dismissNotification(element) {
            const notification = element.closest('.notification');
            if (notification && !notification.classList.contains('notification-exit')) {
                notification.classList.remove('notification-enter');
                notification.classList.add('notification-exit');
               
                setTimeout(() => {
                    notification.remove();
                }, 500); 
            }
        }

  
        function getNotificationIcon(type) {
        
            const svgStyle = "width:24px; height:24px;";
            switch (type) {
                case 'success':
                    return `<svg style="${svgStyle}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
                case 'error':
                    return `<svg style="${svgStyle}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
                case 'info':
                    return `<svg style="${svgStyle}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
                case 'warning':
                     return `<svg style="${svgStyle}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
                default:
                    return '';
            }
        }

    finishSetupBtn.addEventListener('click', () => {
  
    });

     offline.addEventListener('click', () => {
  

   localStorage.setItem('discordUsername', "Guest");
            getFortniteStatus();
            fetchAndDisplayShop();
            pingAllServers();
            startPingInterval();
        setupModal.style ='display : none;'
        mainAppScreen.style ='display : flex; visibility : visible;'
    saveSettings();

    });

 
    languageSelect.addEventListener('change', () => { loadLanguage(languageSelect.value).then(saveSettings); });
    
    iconsse.addEventListener('change', () => { buildSidebar(iconsse.value).then(saveSettings); });
    

    pingIntervalSelect.addEventListener('change', () => {
        appSettings.pingInterval = parseInt(pingIntervalSelect.value);
        saveSettings();
        startPingInterval();
    });

    
    startupCheckbox.addEventListener('change', () => {
        appSettings.startup = startupCheckbox.checked;
        saveSettings();
        window.chrome.webview.hostObjects.controller.SetStartup(appSettings.startup);
    });
    
    resetAppBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to clear all app data? The app will restart.')) {
            localStorage.clear();
            window.location.reload();
        }

        
    });

    refreshPingsBtn.addEventListener('click', pingAllServers);
 refreshPingsBtn.addEventListener('click', showNotification.bind(null, 'info', 'Refresh', 'Refreshing...'));



    // --- START APP ---
  
document.addEventListener('DOMContentLoaded', () => {

      initialize();

});



function refresh() {

initialize();


}

export default refresh;

