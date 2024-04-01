(function() {
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
    background: 0px 0px repeat rgb(239, 239, 239);
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
  opacity: .5
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
    
#cbiJiraAPIContent th, #cbiJiraAPIContent td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

#cbiJiraAPIContent th {
  background-color: #007bff;
  color: white;
}

#cbiJiraAPIContent tr:nth-child(even) {
  background-color: #f2f2f2;
}

#cbiJiraAPIContent tr:hover {
  background-color: #ddd;
}

#cbiJiraAPIContent .header-row, #cbiJiraAPIContent .total-row {
	  background-color: #454545  !important;
      color: white;
}

#cbiJiraAPIContent .header-row:hover, #cbiJiraAPIContent .total-row:hover {
	  background-color: #454545  !important;
      color: white;
}
	
</style>

`;

if (document.getElementById('cbiJiraAPIContent')) {
	document.body.removeChild(document.getElementById('cbiJiraAPIContent'));
}
const container = document.createElement('div');
container.innerHTML = content;
container.setAttribute('id', 'cbiJiraAPIContent');
document.body.appendChild(container);

const elements = {
  container : container,
  retrieveDataBtn: document.getElementById('retrieveDataBtn'),
  closePopupBtn: document.getElementById('closePopupBtn'),
  buildComponentHoursBtn: document.getElementById('buildComponentHoursBtn'),
  buildResourceHoursBtn: document.getElementById('buildResourceHoursBtn'),
  buildResourceHoursBtn: document.getElementById('buildResourceHoursBtn'),
  startDate: document.getElementById('startDate'),
  endDate: document.getElementById('endDate'),
  project: document.getElementById('project'),
  resultDiv: document.getElementById('result'),

};
const inputs = ['startDate', 'endDate', 'project'];
var jiraJson;
elements.retrieveDataBtn.disabled = false;
elements.closePopupBtn.addEventListener('click', function () {
	event.preventDefault(); 
	document.body.removeChild(container);
});
elements.retrieveDataBtn.addEventListener('click', function (event) {
	event.preventDefault(); 
	var startDate = new Date(elements.startDate.value);
	var endDate = new Date(elements.endDate.value);
	if (startDate <= endDate){
		elements.retrieveDataBtn.disabled = true;
		jiraJson = null;
		getJiraData();
	} else {
		elements.startDate.classList.add('t-input-error');
		elements.endDate.classList.add('t-input-error');
	}
});
elements.buildComponentHoursBtn.addEventListener('click', function (event) {
	event.preventDefault(); // Prevent default behavior of button click
	buildComponentHoursTable();
});
elements.buildResourceHoursBtn.addEventListener('click', function (event) {
	event.preventDefault(); // Prevent default behavior of button click
	buildResourceHoursTable();
});

inputs.forEach((input, index) => {
	elements[input].addEventListener('change', (event) => {
		elements.buildResourceHoursBtn.disabled = true;
		elements.buildComponentHoursBtn.disabled = true;
		elements.retrieveDataBtn.disabled = false;
		elements[input].classList.remove('t-input-error');
		var startDate = new Date(elements.startDate.value);
		var endDate = new Date(elements.endDate.value);
		if (startDate <= endDate){
			elements.startDate.classList.remove('t-input-error');
			elements.endDate.classList.remove('t-input-error');
		}
	});
});

function getJiraData() {
	let apiUrl = "https://jira.cornerstonebrands.com/rest/api/2/search?jql=worklogDate%20%3E=%20%22" + formatDate(elements.startDate.value) + "%22%20AND%20worklogDate%20%3C=%20%22" + formatDate(elements.endDate.value) + "%22%20AND%20project%20=%20%22" + elements.project.value + "%22&fields=components,worklog,timetracking&maxResults=500";
	let headers = new Headers();
	headers.append('Content-Type', 'application/json');

	fetch(apiUrl, {
		method: 'GET',
		headers: headers
	})
	.then(response => response.json())
	.then(data => {
		console.log("Data has been retrieved");
		jiraJson = data;
		elements.buildResourceHoursBtn.disabled = false;
		elements.buildComponentHoursBtn.disabled = false;
	})
	.catch(error => {
		console.error('Error:', error);
	});
}

function buildComponentHoursTable() {
	elements.resultDiv.innerHTML = "<h2>Component vs Hours Spent Table</h2>";
	var componentHours = {};
	var startDate = new Date(elements.startDate.value);
	var endDate = new Date(elements.endDate.value);
	endDate.setHours(23, 59, 59, 999);
	var totalHours = 0;
	jiraJson.issues.forEach(function (issue) {
		var hours = 0;
		issue.fields.worklog.worklogs.forEach(function (worklog) {
			var worklogDate = new Date(worklog.started);
			if (worklogDate >= startDate && worklogDate <= endDate) {
				hours += worklog.timeSpentSeconds / 3600;
			}
		});
		issue.fields.components.forEach(function (component) {
			var componentName = component.name;
			if (!componentHours[componentName]) {
				componentHours[componentName] = hours;
			} else {
				componentHours[componentName] += hours;
			}
			totalHours += hours;
		});
	});

	var table = document.createElement("table");
	var headerRow = table.insertRow();
	var componentHeader = headerRow.insertCell(0);
	componentHeader.textContent = "Component";
	var hoursHeader = headerRow.insertCell(1);
	hoursHeader.textContent = "Hours Spent";
	headerRow.classList.add('header-row')

	Object.keys(componentHours).forEach(function (componentName) {
		var row = table.insertRow();
		var componentCell = row.insertCell(0);
		componentCell.textContent = componentName;
		var hoursCell = row.insertCell(1);
		hoursCell.textContent = componentHours[componentName];
	});
	
	var row = table.insertRow();
	row.classList.add('total-row')
	var componentCell = row.insertCell(0);
	componentCell.textContent = "Total Hours";
	var hoursCell = row.insertCell(1);
	hoursCell.textContent = totalHours;
	
	elements.resultDiv.appendChild(table);
}

function buildResourceHoursTable() {
	elements.resultDiv.innerHTML = "<h2>Component vs Hours Spent for Each Resource Table</h2>";
	var resoursHours = {};
	var startDate = new Date(elements.startDate.value);
	var endDate = new Date(elements.endDate.value);
	endDate.setHours(23, 59, 59, 999);
	jiraJson.issues.forEach(function (issue) {
		var mainComponentName = issue.fields.components[0].name;
		issue.fields.worklog.worklogs.forEach(function (worklog) {
			var worklogDate = new Date(worklog.started);
			var totalHours = 0;
			if (worklogDate >= startDate && worklogDate <= endDate) {
				totalHours += worklog.timeSpentSeconds / 3600;
			}
			var name = worklog.author.displayName;
			if (!resoursHours[name]) {
				resoursHours[name] = {};
				resoursHours[name][mainComponentName] = totalHours;
			} else if (!resoursHours[name][mainComponentName]) {
				resoursHours[name][mainComponentName] = totalHours;
			} else {
				resoursHours[name][mainComponentName] += totalHours;
			}

		});

	});

	var table = document.createElement("table");
	var headerRow = table.insertRow();
	var resourceNameHeader = headerRow.insertCell();
	resourceNameHeader.textContent = "Resource Name";
	resourceNameHeader.classList.add('header-row');

	var componentNames = new Set();
	Object.values(resoursHours).forEach(function (resourceData) {
		Object.keys(resourceData).forEach(function (componentName) {
			componentNames.add(componentName);
		});
	});
	componentNames.forEach(function (componentName, index) {
		var componentHeader = headerRow.insertCell();
		componentHeader.textContent = componentName;
		componentHeader.classList.add('header-row');
	});
	
	var componentHeader = headerRow.insertCell();
	componentHeader.textContent = "Total";
	componentHeader.classList.add('header-row');

	Object.keys(resoursHours).forEach(function (resourceName, rowIndex) {
		var row = table.insertRow();
		var resourceNameCell = row.insertCell();
		resourceNameCell.textContent = resourceName;
		var resoursHoursTotal = 0;
		resourceNameCell.classList.add('header-row');
		componentNames.forEach(function (componentName, columnIndex) {
			var componentCell = row.insertCell();
			componentCell.textContent = resoursHours[resourceName][componentName] || "0"; // If no data, show 0
			resoursHoursTotal += resoursHours[resourceName][componentName] || 0
		});
		var totalCell = row.insertCell();
		totalCell.textContent = resoursHoursTotal;
		totalCell.classList.add('total-row');

	});
	elements.resultDiv.appendChild(table);
}

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
})();
