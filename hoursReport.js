
    var content = `
    <div class="popup-header">
	  <span id="closePopupBtn" class="close">&#x2715;</span>
	  <h1>Jira Time report</h1>
	</div>
    <div id="jiraHouesReport">
        <form id="reportForm">
			<div class="input">
				<label class="t-input-label"  for="startDate">Start Date:</label>
				<input type="date" class="t-input-box" id="startDate" required>
            </div>
			<div class="input">
				<label class="t-input-label" for="endDate">End Date:</label>
				<input type="date" class="t-input-box" id="endDate" required>
			</div>
			<div class="input">
            <label class="t-input-label" for="project">Project:</label>
            <select id="project" class="t-input-box t-select" required>
                <option value="WCS Enhancement/Bug Tracker">WCS Enhancement/Bug Tracker</option>
				<option value="CBI Mobile">CBI Mobile</option>
                <!-- Add more options as needed -->
            </select>
			</div>
            <button type="button" class="t-btn" id="retrieveDataBtn" disabled><span>Retrieve Data from Jira</span></button>
        </form>
		<div class="reportBtns">
        <button type="button" class="t-btn" id="buildComponentHoursBtn" disabled><span>Component vs Hours Spent</span></button>
        <button type="button" class="t-btn" id="buildResourceHoursBtn" disabled><span>Component vs Hours Spent for Each Resource</span></button>
		</div>
        <div id="result"></div>
    </div>
	<style>
#cbiJiraAPIContent {  
    position: fixed;
    z-index: 2147483647;
    top: 0px;
    left: 10%;
    margin: 0px;
    padding: 30px;
    width: 80%;
    background: url(bg.gif) 0px 0px repeat rgb(239, 239, 239);
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    box-shadow: rgba(255, 255, 255, 0.6) 0px 1px 0px inset, rgba(0, 0, 0, 0.56) 0px 22px 70px 4px, rgba(0, 0, 0, 0.3) 0px 0px 0px 1px;
    -webkit-transform-origin-x: 0px;
    -webkit-transform-origin-y: 0px;
    padding: 15px 30px 30px 30px;
    max-height: 100vh;
	overflow: scroll;
}
#cbiJiraAPIContent h1 {
    color: #172b4d;
    font-weight: 600;
    text-align: center;
}

#cbiJiraAPIContent form {
    margin-bottom: 20px;
}

#cbiJiraAPIContent .input {
    width: 30%;
    display: inline-block;
    padding: 15px;
}

#cbiJiraAPIContent .popup-header {
    display: flex;
    align-items: center;
    position: relative;
}

#cbiJiraAPIContent .popup-header h1 {
    width: 100%;
}
#cbiJiraAPIContent #closePopupBtn {
    position: absolute;
    font-size: 30px;
}

#cbiJiraAPIContent #closePopupBtn:hover {
    cursor: pointer;
}

#cbiJiraAPIContent #jiraHouesReport {
    padding-top: 15px;
}

#cbiJiraAPIContent input[type="date"] {
  position: relative;
}

#cbiJiraAPIContent input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  color: transparent;
  background: transparent;
}

#cbiJiraAPIContent .t-btn,
#cbiJiraAPIContent .t-btn-secondary {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 0;
  border-radius: 0;
  color: #fff;
  font-weight: 500;
  letter-spacing: .07em;
  text-decoration: none;
  text-transform: uppercase
}
#cbiJiraAPIContent .t-btn > * {
  position: relative;
  z-index: 1
}

#cbiJiraAPIContent .t-btn::before {
  content: "";
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #404040;
  transition: all .3s
}

#cbiJiraAPIContent .t-btn:hover::before {
  background-color: #000;
  width: calc(100% + 6px);
  height: calc(100% + 6px);
  top: -3px;
  left: -3px
}

#cbiJiraAPIContent .t-btn:focus {
  outline: 0;
  position: relative
}
#cbiJiraAPIContent .t-btn:focus::after {
  content: "";
  display: block;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  position: absolute;
  top: -4px;
  left: -4px;
  border: 1px solid #404040
}

#cbiJiraAPIContent .t-btn.is-disabled,
#cbiJiraAPIContent .t-btn:disabled {
  pointer-events: none;
  background-color: #959595;
  opacity: .8
}

#cbiJiraAPIContent .t-input-box {
  margin: 8px 0 40px 0;
  max-width: 100%;
  width: 335px;
  padding: 18px 0 18px 16px;
  border: 1px solid #404040;
  -moz-appearance: auto;
  appearance: auto;
  -webkit-appearance: none;
  border-radius: 0
}
@media (min-width:1280px) {
  #cbiJiraAPIContent .t-input-box {
    width: 626px
  }
}
#cbiJiraAPIContent .t-input-label {
  font-family: Avenir,Arial,sans-serif;
  font-weight: 900;
  font-size: 1rem;
  line-height: 1.5714285714rem
}
#cbiJiraAPIContent .t-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  height: 60px;
  line-height: 50px;
  padding: 0 8px;
  border: 1px solid #404040;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='6' viewBox='0 0 12 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 5L11 0.999999' stroke='%23404040' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: calc(100% - 12px) center;
  background-repeat: no-repeat
}
#cbiJiraAPIContent .t-select:invalid {
  color: rgba(64,64,64,.5)
}
#cbiJiraAPIContent .t-input-error {
  margin: 8px 0 8px 0;
  border: 1px solid #9f3025
}
#cbiJiraAPIContent .t-input-error-message {
  vertical-align: middle;
  font-family: Avenir;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0;
  display: inline-block;
  padding-bottom: 15px
}

#cbiJiraAPIContent button#retrieveDataBtn {
    width: 50%;
    margin-left: 25%;
}

#cbiJiraAPIContent .reportBtns {
    border-top: 1px solid;
    padding-top: 20px;
    display: flex;
    gap: 5%;
}
#cbiJiraAPIContent .reportBtns button {
    width: 48%;
}

#cbiJiraAPIContent #result {
    margin-top: 20px;
}

#cbiJiraAPIContent table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-family: Arial, sans-serif;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #007bff;
      color: white;
    }
    
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    tr:hover {
      background-color: #ddd;
    }
	
</style>

`;

    var container = document.createElement('div');
    container.innerHTML = content;
    container.setAttribute('id', 'cbiJiraAPIContent');
    document.body.appendChild(container);

    var startDate;
    var endDate;
    var jiraJson;

    var retrieveDataBtn = document.getElementById('retrieveDataBtn');
    retrieveDataBtn.disabled = false;

    var closePopupBtn = document.getElementById('closePopupBtn');
    closePopupBtn.addEventListener('click', function () {
        document.body.removeChild(container);
    });

    var retrieveDataBtn = document.getElementById('retrieveDataBtn');
    retrieveDataBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior of button click
        getJiraData();
    });

    var buildComponentHoursBtn = document.getElementById('buildComponentHoursBtn');
    buildComponentHoursBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior of button click
        buildComponentHoursTable();
    });

    var buildResourceHoursBtn = document.getElementById('buildResourceHoursBtn');
    buildResourceHoursBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior of button click
        buildResourceHoursTable();
    });

    function getJiraData() {
        startDate = document.getElementById("startDate").value;
        endDate = document.getElementById("endDate").value;
        var project = document.getElementById("project").value;
        var componentHoursBtn = document.getElementById('buildComponentHoursBtn');
        var resourceHoursBtn = document.getElementById('buildResourceHoursBtn');

        var apiUrl = "https://jira.cornerstonebrands.com/rest/api/2/search?jql=worklogDate%20%3E=%20%22" + formatDate(startDate) + "%22%20AND%20worklogDate%20%3C=%20%22" + formatDate(endDate) + "%22%20AND%20project%20=%20%22" + project + "%22&fields=components,worklog,timetracking&maxResults=100";
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        fetch(apiUrl, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // You can further process the data here
                jiraJson = data;
                componentHoursBtn.disabled = false;
                resourceHoursBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function buildComponentHoursTable() {
        var resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "<h2>Component vs Hours Spent Table</h2>";

        var componentHours = {};
        var startDate2 = new Date(startDate);
        var endDate2 = new Date(endDate);

		// Loop through each issue in the JSON response
        jiraJson.issues.forEach(function (issue) {
            // Initialize total hours for the current issue
            var totalHours = 0;

            // Loop through each worklog entry in the issue
            issue.fields.worklog.worklogs.forEach(function (worklog) {
                // Check if the worklog date falls within the specified date range
                var worklogDate = new Date(worklog.started);

                if (worklogDate >= startDate2 && worklogDate <= endDate2) {
                    // Accumulate total hours spent on this component
                    totalHours += worklog.timeSpentSeconds / 3600;
                }
            });

            // Loop through each component in the issue
            issue.fields.components.forEach(function (component) {
                var componentName = component.name;

                // Update total hours for the current component
                if (!componentHours[componentName]) {
                    // If the component doesn't exist in the componentHours object, initialize it
                    componentHours[componentName] = totalHours;
                } else {
                    // If the component already exists, add the total hours
                    componentHours[componentName] += totalHours;
                }
            });
        });

        var table = document.createElement("table");
        // Create a header row
        var headerRow = table.insertRow();
        var componentHeader = headerRow.insertCell(0);
        componentHeader.textContent = "Component";
        var hoursHeader = headerRow.insertCell(1);
        hoursHeader.textContent = "Hours Spent";

        // Iterate over componentHours object and populate the table
        Object.keys(componentHours).forEach(function (componentName) {
            var row = table.insertRow();
            var componentCell = row.insertCell(0);
            componentCell.textContent = componentName;
            var hoursCell = row.insertCell(1);
            hoursCell.textContent = componentHours[componentName];
        });

        // Append the table to the "jira" element
        resultDiv.appendChild(table);
    }

    function buildResourceHoursTable() {
        var resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "<h2>Component vs Hours Spent for Each Resource Table</h2>";
        var resoursHours = {};
        var startDate2 = new Date(startDate);
        var endDate2 = new Date(endDate);

        // Loop through each issue in the JSON response
        jiraJson.issues.forEach(function (issue) {
            // Initialize total hours for the current issue
            var mainComponentName = issue.fields.components[0].name;

            // Loop through each worklog entry in the issue
            issue.fields.worklog.worklogs.forEach(function (worklog) {
                // Check if the worklog date falls within the specified date range
                var worklogDate = new Date(worklog.started);
                var totalHours = 0;
                if (worklogDate >= startDate2 && worklogDate <= endDate2) {
                    // Accumulate total hours spent on this component
                    totalHours += worklog.timeSpentSeconds / 3600;
                }
                var name = worklog.author.displayName;

                if (!resoursHours[name]) {
                    // If the component doesn't exist in the componentHours object, initialize it
                    resoursHours[name] = {};
                    resoursHours[name][mainComponentName] = totalHours;
                } else if (!resoursHours[name][mainComponentName]) {
                    // If the component already exists, add the total hours
                    resoursHours[name][mainComponentName] = totalHours;
                } else {
                    resoursHours[name][mainComponentName] += totalHours;
                }

            });

        });

        var table = document.createElement("table");

// Create header row
        var headerRow = table.insertRow();

        var resourceNameHeader = headerRow.insertCell();
        resourceNameHeader.textContent = "Resource Name";

// Gather unique component names
        var componentNames = new Set();
        Object.values(resoursHours).forEach(function (resourceData) {
            Object.keys(resourceData).forEach(function (componentName) {
                componentNames.add(componentName);
            });
        });

// Add component headers
        componentNames.forEach(function (componentName, index) {
            var componentHeader = headerRow.insertCell();
            componentHeader.textContent = componentName;
        });

// Populate table with data
        Object.keys(resoursHours).forEach(function (resourceName, rowIndex) {
            var row = table.insertRow();
            var resourceNameCell = row.insertCell();
            resourceNameCell.textContent = resourceName;

            componentNames.forEach(function (componentName, columnIndex) {
                var componentCell = row.insertCell();
                componentCell.textContent = resoursHours[resourceName][componentName] || "0"; // If no data, show 0
            });
        });

// Append the table to the "jira" element
        resultDiv.appendChild(table);
    }

// Function to format date as YYYY/MM/DD
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    }
