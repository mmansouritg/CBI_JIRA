var content = `
       <div class="popup-header">
          <span id="closePopupBtn" class="close">&times;</span>
          <h1>Jira Extension</h1>
        </div>
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
container.classList.add('container');
document.body.appendChild(container);

var startDate;
var endDate;
var jiraJson;

var retrieveDataBtn = document.getElementById('retrieveDataBtn');
retrieveDataBtn.disabled = false;

var container = document.querySelector('.container');
container.style.width = '80vw'; // Set width to 80% of the viewport width

var popup = document.querySelector('.container');
document.addEventListener('click', function(event) {
    // Check if the clicked element is not inside the popup
    if (!popup.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
    }
});

var closePopupBtn = document.getElementById('closePopupBtn');
closePopupBtn.addEventListener('click', function() {
    window.close();
});

var retrieveDataBtn = document.getElementById('retrieveDataBtn');
retrieveDataBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default behavior of button click
    getJiraData();
});

var buildComponentHoursBtn = document.getElementById('buildComponentHoursBtn');
buildComponentHoursBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default behavior of button click
    buildComponentHoursTable();
});

var buildResourceHoursBtn = document.getElementById('buildResourceHoursBtn');
buildResourceHoursBtn.addEventListener('click', function(event) {
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
    jiraJson.issues.forEach(function(issue) {
        // Initialize total hours for the current issue
        var totalHours = 0;

        // Loop through each worklog entry in the issue
        issue.fields.worklog.worklogs.forEach(function(worklog) {
            // Check if the worklog date falls within the specified date range
            var worklogDate = new Date(worklog.started);
            
            if (worklogDate >= startDate2 && worklogDate <= endDate2) {
                // Accumulate total hours spent on this component
                totalHours += worklog.timeSpentSeconds / 3600;
            }
        });

        // Loop through each component in the issue
        issue.fields.components.forEach(function(component) {
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
    Object.keys(componentHours).forEach(function(componentName) {
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
jiraJson.issues.forEach(function(issue) {
    // Initialize total hours for the current issue
    var mainComponentName = issue.fields.components[0].name;

    // Loop through each worklog entry in the issue
    issue.fields.worklog.worklogs.forEach(function(worklog) {
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
        } else if (!resoursHours[name][mainComponentName]){
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
var resourceNameHeader = headerRow.insertCell(0);
resourceNameHeader.textContent = "Resource Name";

// Gather unique component names
var componentNames = new Set();
Object.values(resoursHours).forEach(function(resourceData) {
    Object.keys(resourceData).forEach(function(componentName) {
        componentNames.add(componentName);
    });
});

// Add component headers
componentNames.forEach(function(componentName, index) {
    var componentHeader = headerRow.insertCell(index + 1);
    componentHeader.textContent = componentName;
});

// Populate table with data
Object.keys(resoursHours).forEach(function(resourceName, rowIndex) {
    var row = table.insertRow(rowIndex + 1);
    var resourceNameCell = row.insertCell(0);
    resourceNameCell.textContent = resourceName;

    componentNames.forEach(function(componentName, columnIndex) {
        var componentCell = row.insertCell(columnIndex + 1);
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
