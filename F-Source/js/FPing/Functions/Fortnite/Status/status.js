
  async function getFortniteStatus() {
        const statusList = document.getElementById('status-container');
        const epicStatusApiUrl = 'https://status.epicgames.com/api/v2/summary.json';
        const fortniteServices = ['Fortnite', 'LEGO Fortnite', 'Fortnite Festival', 'UEFN', '', 'Account Services', '', 'Epic Games Store', 'Epic Online Services' , 'Fortnite Crew', '',  ];
        const generalstatus = document.getElementById('general-status');


        try {
            const response = await fetch(epicStatusApiUrl);
            const data = await response.json();

            statusList.innerHTML = ''; // Clear the loading message

            const components = data.components;
            const relevantComponents = components.filter(component => fortniteServices.includes(component.name));

            if (relevantComponents.length > 0) {
                relevantComponents.forEach(component => {
                    const statusItem = document.createElement('div');
                    statusItem.classList.add('server-item');

                    const statusNameSpan = document.createElement('span');
                    statusNameSpan.classList.add('status-name');
                    statusNameSpan.textContent = component.name;

                    const statusIndicator = document.createElement('div');
                    statusIndicator.classList.add('status-indicator', component.status);

                    statusItem.appendChild(statusNameSpan);
                    statusItem.appendChild(statusIndicator);
                    statusList.appendChild(statusItem);

                    generalstatus.style.backgroundColor =  data.status.indicator === 'none' ? 'green' : data.status.indicator === 'minor' ? 'orange' : 'red'
                    

                });
            } else {
                statusList.innerHTML = `
                
                   <div class="error-container">
                <img src="./imgs/icons/cry.png" alt="Error icon" class="error-icon">
                <p class="error-message">Error.</p>
                <code class="error-details">[Reason: ${error}]</code>
            </div>
                
                
                `;
            }

        } catch (error) {
            statusList.innerHTML = `
            
               <div class="error-container">
                <img src="./imgs/icons/cry.png" alt="Error icon" class="error-icon">
                <p class="error-message">Could not load Fortnite Status.</p>
                <code class="error-details">[Reason: ${error}]</code>
            </div>
            
            
            `;
            console.error("Error fetching Epic Games status:", error);
        }
    }

 
        getFortniteStatus();
        


    

export default getFortniteStatus;

