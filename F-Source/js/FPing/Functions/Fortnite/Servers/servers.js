// HTML elements
    const mainAppScreen = document.getElementById('main-app-screen');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const serverListContainer = document.getElementById('server-list-container');
    const refreshPingsBtn = document.getElementById('refresh-pings-btn');
    const pingIntervalSelect = document.getElementById('ping-interval-select');




    async function pingAllServers() {
        const response = await fetch('./data/servers.json');
        const servers = await response.json();
        if (serverListContainer.innerHTML === '') { // First time loading
             servers.forEach(server => {
                 serverListContainer.innerHTML += `
                    <div class="server-item" id="server-${server.Name}">
                    
                        <span>${server.Name}</span>
                        
                        <span style="font-size: 14px;">${server.ServerAddress}</span>
                        <div class="server-item-info">
                            <div class="ping-spinner"></div>
                            <span class="ping"></span>
                        </div>
                    </div>`;
             });
        }
        
        servers.forEach(server => {
            try {
            const serverElement = document.getElementById(`server-${server.Name}`);
            const pingElement = serverElement.querySelector('.ping');
            const spinnerElement = serverElement.querySelector('.ping-spinner');
            spinnerElement.style.display = 'block';
            pingElement.textContent = '';

            window.chrome.webview.hostObjects.controller.PingServer(server.ServerAddress).then(ping => {
                spinnerElement.style.display = 'none';
                if (ping >= 0) {
                    pingElement.textContent = `${ping} ms`;
                    pingElement.className = 'ping';
                    if (ping < 50) pingElement.classList.add('good');
                    else if (ping < 100) pingElement.classList.add('medium');
                    else pingElement.classList.add('bad');
                } else {
                    pingElement.textContent = 'Error';
                    pingElement.className = 'ping error';
                }
            });
         } catch (error) { console.log('Error : User is not using FPing App')}
        });
    }


export default pingAllServers;