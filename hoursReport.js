    var content = `
        <div id="jiraHouesReport">
            <form id="reportForm">
                <label for="startDate">Start Date:</label>
                <input type="date" id="startDate" required><br><br>
                
                <label for="endDate">End Date:</label>
                <input type="date" id="endDate" required><br><br>
                
                <label for="project">Project:</label>
                <select id="project" required>
                    <option value="WCS Enhancement/Bug Tracker">WCS Enhancement/Bug Tracker</option>
                    <!-- Add more options as needed -->
                </select><br><br>
                
                <button type="button" id="retrieveDataBtn" disabled>Retrieve Data from Jira</button>
            </form>
        
            <hr>
        
            <button type="button" id="buildComponentHoursBtn" disabled>Component vs Hours Spent</button>
            <hr>
            <button type="button" id="buildResourceHoursBtn" disabled>Component vs Hours Spent for Each Resource</button>
            
            <div id="result"></div>
        </div>
        <link rel="stylesheet" href="https://raw.githubusercontent.com/mmansouritg/CBI_JIRA/main/hoursReport.css">
    `;
    
    var container = document.createElement('div');
    container.innerHTML = content;
    document.body.appendChild(container);
