(function() {
var content = `
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
			<option value="SPARK Front-end Platform">SPARK Front-end Platform</option>
			<option value="CBI Mobile">CBI Mobile</option>
			<!-- Add more options as needed -->
		</select>
		</div>
		<button type="button" class="t-btn" id="retrieveDataBtn" disabled><span>Retrieve Data from Jira</span></button>
	</form>
	<div class="reportBtns">
	<button type="button" class="t-btn" id="buildComponentHoursBtn" disabled><span>Component vs Hours Spent</span></button>
	<button type="button" class="t-btn" id="buildResourceHoursBtn" disabled><span>Component vs Hours Spent for Each Resource</span></button>
	<button type="button" class="t-btn" id="buildResourceHoursBtnWithComment" disabled><span>Component vs Hours Spent for Each Resource (Comment)</span></button>
	<button type="button" class="t-btn" id="buildTicketsPerUserBtn" disabled><span>Tickets has been accomplished Per Each Resource</span></button>
	</div>|	
	<div id="result"></div>

</div>
<link href="https://cdn.jsdelivr.net/gh/mmansouritg/CBI_JIRA@refs/heads/main/cbi-jira-style.css" rel="stylesheet" type="text/css">
`;

if (document.getElementById('cbiJiraAPIContent')) {
	document.body.removeChild(document.getElementById('cbiJiraAPIContent'));
}
const container = document.createElement('div');
container.innerHTML = content;
container.setAttribute('id', 'cbiJiraAPIContent');
document.body.appendChild(container);

const script = document.createElement('script');
script.src = 'https://www.gstatic.com/charts/loader.js';
document.head.appendChild(script);

const elements = {
  container : container,
  retrieveDataBtn: document.getElementById('retrieveDataBtn'),
  closePopupBtn: document.getElementById('closePopupBtn'),
  buildComponentHoursBtn: document.getElementById('buildComponentHoursBtn'),
  buildResourceHoursBtn: document.getElementById('buildResourceHoursBtn'),
  buildResourceHoursBtnWithComment: document.getElementById('buildResourceHoursBtnWithComment'),
  buildTicketsPerUserBtn: document.getElementById('buildTicketsPerUserBtn'),
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

elements.buildResourceHoursBtnWithComment.addEventListener('click', function (event) {
	event.preventDefault(); // Prevent default behavior of button click
	buildResourceHoursWithCommentTable();
});


elements.buildTicketsPerUserBtn.addEventListener('click', function (event) {
	event.preventDefault(); // Prevent default behavior of button click
	buildTicketsPerUserTable();
});

inputs.forEach((input, index) => {
	elements[input].addEventListener('change', (event) => {
		elements.buildResourceHoursBtn.disabled = true;
		elements.buildResourceHoursBtnWithComment.disabled = true;
		elements.buildComponentHoursBtn.disabled = true;
		elements.buildTicketsPerUserBtn.disabled = true;
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
	let apiUrl = "https://jira.cornerstonebrands.com/rest/api/2/search?jql=worklogDate%20%3E=%20%22" + formatDate(elements.startDate.value) + "%22%20AND%20worklogDate%20%3C=%20%22" + formatDate(elements.endDate.value) + "%22%20AND%20project%20=%20%22" + elements.project.value + "%22&fields=components,worklog,timetracking&maxResults=600";
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
		return retriveAllWorkLog(jiraJson);
	})
	.catch(error => {
		console.error('Error:', error);
	});
}


async function retriveAllWorkLog(jiraJson) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const worklogFetchPromises = jiraJson.issues
        .filter(issue => issue.fields.worklog.total > 20)
        .map(issue =>
            fetch(`${issue.self}/worklog`, {
                method: 'GET',
                headers: headers
            })
            .then(response => response.json())
            .then(data => {
                console.log("Jira Data has been retrieved " + issue.key);
                issue.fields.worklog = data;
            })
            .catch(error => {
                console.error('Error:', error);
            })
        );

    await Promise.all(worklogFetchPromises);

    // Enable buttons only after all fetch requests are completed
    elements.buildResourceHoursBtn.disabled = false;
    elements.buildComponentHoursBtn.disabled = false;
    elements.buildTicketsPerUserBtn.disabled = false;
	elements.buildResourceHoursBtnWithComment.disabled = false;	
}

function buildComponentHoursTable() {
  elements.resultDiv.innerHTML = `
    <h2>Component vs Hours Spent Table</h2>
    <details>
      <summary>Select Components</summary>
      <div id="filterCheckboxes"></div>
    </details>
	<button id="exportCsvBtn">Export to CSV</button>`;


  const componentHours = {};
  const startDate = new Date(elements.startDate.value);
  const endDate = new Date(elements.endDate.value);
  endDate.setHours(23, 59, 59, 999);

  jiraJson.issues.forEach(issue => {
    let hours = 0;
    issue.fields.worklog.worklogs.forEach(worklog => {
      const worklogDate = new Date(worklog.started);
      if (worklogDate >= startDate && worklogDate <= endDate) {
        hours += worklog.timeSpentSeconds / 3600;
      }
    });
    issue.fields.components.forEach(component => {
      const componentName = component.name;
      componentHours[componentName] = (componentHours[componentName] || 0) + hours;
    });
  });

  const checkboxesDiv = document.getElementById("filterCheckboxes");
  Object.keys(componentHours).forEach(componentName => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = componentName;
    checkbox.checked = true;
    checkbox.addEventListener("change", () => filterTable(table));
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(componentName));
    checkboxesDiv.appendChild(label);
    checkboxesDiv.appendChild(document.createElement("br"));
  });


  const table = document.createElement("table");
  const headerRow = table.insertRow();
  headerRow.classList.add('header-row');

  ["Component", "Hours Spent"].forEach((headerText, idx) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerCell.style.cursor = "pointer";
    headerCell.addEventListener("click", () => sortTableByColumn(table, idx));
    headerRow.appendChild(headerCell);
  });

  Object.keys(componentHours).forEach(componentName => {
    const row = table.insertRow();
    row.insertCell().textContent = componentName;
    row.insertCell().textContent = componentHours[componentName].toFixed(2);
  });

  const totalRow = table.insertRow();
  totalRow.classList.add('total-row');
  totalRow.insertCell().textContent = "Total Hours";
  totalRow.insertCell().textContent = calculateTotalHours(componentHours, Object.keys(componentHours)).toFixed(2);

  elements.resultDiv.appendChild(table);
  
  document.getElementById("exportCsvBtn").addEventListener("click", () => exportTableToCSV(table, "component_hours.csv"));

  function calculateTotalHours(hoursData, components) {
    return components.reduce((sum, component) => sum + (hoursData[component] || 0), 0);
  }

  function filterTable(table) {
    const checkedComponents = Array.from(document.querySelectorAll('#filterCheckboxes input:checked')).map(cb => cb.value);
    const rows = table.rows;
    for (let i = 1; i < rows.length - 1; i++) {
      const cellText = rows[i].cells[0].textContent;
      rows[i].style.display = checkedComponents.includes(cellText) ? "" : "none";
    }
    totalRow.cells[1].textContent = calculateTotalHours(componentHours, checkedComponents).toFixed(2);
  }
  function sortTableByColumn(table, columnIndex) {
  const rowsArray = Array.from(table.rows).slice(1, -1);
  const isNumeric = columnIndex === 1;
  const sortedRows = rowsArray.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent;
    const cellB = b.cells[columnIndex].textContent;
    return isNumeric ? parseFloat(cellA) - parseFloat(cellB) : cellA.localeCompare(cellB);
  });

  sortedRows.forEach(row => table.tBodies[0].insertBefore(row, table.tBodies[0].lastChild));
}
}
function buildResourceHoursTable() {
  elements.resultDiv.innerHTML = `
    <h2>Component vs Hours Spent for Each Resource Table</h2>
    <details>
      <summary>Select Components</summary>
      <div id="componentFilterCheckboxes"></div>
    </details>
    <details>
      <summary>Select Resources</summary>
      <div id="resourceFilterCheckboxes"></div>
    </details>
    <button id="exportCsvBtn">Export to CSV</button>`;


  const resoursHours = {};
  const startDate = new Date(elements.startDate.value);
  const endDate = new Date(elements.endDate.value);
  endDate.setHours(23, 59, 59, 999);

  jiraJson.issues.forEach(issue => {
    const mainComponentName = issue.fields.components[0].name;
    issue.fields.worklog.worklogs.forEach(worklog => {
      const worklogDate = new Date(worklog.started);
      if (worklogDate >= startDate && worklogDate <= endDate) {
        const totalHours = worklog.timeSpentSeconds / 3600;
        const name = worklog.author.displayName;
        resoursHours[name] = resoursHours[name] || {};
        resoursHours[name][mainComponentName] = (resoursHours[name][mainComponentName] || 0) + totalHours;
      }
    });
  });

  const componentNames = Array.from(new Set(Object.values(resoursHours).flatMap(Object.keys))).sort();
  const resourceNames = Object.keys(resoursHours).sort();

  const componentCheckboxesDiv = document.getElementById("componentFilterCheckboxes");
  componentNames.forEach(componentName => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = componentName;
    checkbox.checked = true;
    checkbox.addEventListener("change", () => filterTable(table));
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(componentName));
    componentCheckboxesDiv.appendChild(label);
    componentCheckboxesDiv.appendChild(document.createElement("br"));
  });

  const resourceCheckboxesDiv = document.getElementById("resourceFilterCheckboxes");
  resourceNames.forEach(resourceName => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = resourceName;
    checkbox.checked = true;
    checkbox.addEventListener("change", () => filterTable(table));
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(resourceName));
    resourceCheckboxesDiv.appendChild(label);
    resourceCheckboxesDiv.appendChild(document.createElement("br"));
  });
  


  const table = document.createElement("table");
  const headerRow = table.insertRow();
  headerRow.insertCell().textContent = "Resource Name";
  componentNames.forEach(componentName => headerRow.insertCell().textContent = componentName);
  headerRow.insertCell().textContent = "Total";
  headerRow.classList.add('header-row');

  resourceNames.forEach(resourceName => {
    const row = table.insertRow();
    row.insertCell().textContent = resourceName;
    let resourceTotal = 0;
    componentNames.forEach(componentName => {
      const hours = resoursHours[resourceName][componentName] || 0;
      row.insertCell().textContent = hours.toFixed(2);
      resourceTotal += hours;
    });
    row.insertCell().textContent = resourceTotal.toFixed(2);
  });

  elements.resultDiv.appendChild(table);

  headerRow.querySelectorAll('td').forEach((cell, idx) => {
    cell.style.cursor = "pointer";
    cell.addEventListener("click", () => sortTableByColumn(table, idx));
  });
    document.getElementById("exportCsvBtn").addEventListener("click", () => exportTableToCSV(table, "resource_hours.csv"));

  function filterTable(table) {
    const checkedComponents = Array.from(document.querySelectorAll('#componentFilterCheckboxes input:checked')).map(cb => cb.value);
    const checkedResources = Array.from(document.querySelectorAll('#resourceFilterCheckboxes input:checked')).map(cb => cb.value);

    table.rows[0].querySelectorAll('td').forEach((cell, idx) => {
      if (idx > 0 && idx <= componentNames.length) {
        cell.style.display = checkedComponents.includes(cell.textContent) ? "" : "none";
      }
    });

    Array.from(table.rows).slice(1).forEach(row => {
      const resourceName = row.cells[0].textContent;
      row.style.display = checkedResources.includes(resourceName) ? "" : "none";
      let total = 0;
      row.querySelectorAll('td').forEach((cell, idx) => {
        if (idx > 0 && idx <= componentNames.length) {
          const componentName = table.rows[0].cells[idx].textContent;
          cell.style.display = checkedComponents.includes(componentName) ? "" : "none";
          if (checkedComponents.includes(componentName)) total += parseFloat(cell.textContent);
        }
      });
      row.cells[row.cells.length - 1].textContent = total.toFixed(2);
    });
  }

  function sortTableByColumn(table, columnIndex) {
    const rowsArray = Array.from(table.rows).slice(1);
    const sortedRows = rowsArray.sort((a, b) => {
      const cellA = a.cells[columnIndex].textContent;
      const cellB = b.cells[columnIndex].textContent;
      return columnIndex === 0 ? cellA.localeCompare(cellB) : parseFloat(cellB) - parseFloat(cellA);
    });
    sortedRows.forEach(row => table.tBodies[0].appendChild(row));
  }
}
function buildResourceHoursWithCommentTable() {
  elements.resultDiv.innerHTML = `
    <h2>Component vs Hours Spent for Each Resource (with Comments)</h2>
    <details>
      <summary>Select Components</summary>
      <div id="componentFilterCheckboxes"></div>
    </details>
    <details>
      <summary>Select Resources/Comments</summary>
      <div id="resourceFilterCheckboxes"></div>
    </details>
    <button id="exportCsvBtn">Export to CSV</button>`;

  const resoursHours = {};
  const startDate = new Date(elements.startDate.value);
  const endDate = new Date(elements.endDate.value);
  endDate.setHours(23, 59, 59, 999);

  jiraJson.issues.forEach(issue => {
    const mainComponentName = issue.fields.components[0].name;
    issue.fields.worklog.worklogs.forEach(worklog => {
      const worklogDate = new Date(worklog.started);
      if (worklogDate >= startDate && worklogDate <= endDate) {
        const totalHours = worklog.timeSpentSeconds / 3600;
        let name = worklog.author.displayName;
        if (worklog.comment && worklog.comment.trim() !== '') {
          name = worklog.comment;
        }
        resoursHours[name] = resoursHours[name] || {};
        resoursHours[name][mainComponentName] = (resoursHours[name][mainComponentName] || 0) + totalHours;
      }
    });
  });

  const componentNames = Array.from(new Set(Object.values(resoursHours).flatMap(Object.keys))).sort();
  const resourceNames = Object.keys(resoursHours).sort();

  const componentCheckboxesDiv = document.getElementById("componentFilterCheckboxes");
  componentNames.forEach(componentName => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = componentName;
    checkbox.checked = true;
    checkbox.addEventListener("change", () => filterTable(table));
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(componentName));
    componentCheckboxesDiv.appendChild(label);
    componentCheckboxesDiv.appendChild(document.createElement("br"));
  });

  const resourceCheckboxesDiv = document.getElementById("resourceFilterCheckboxes");
  resourceNames.forEach(resourceName => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = resourceName;
    checkbox.checked = true;
    checkbox.addEventListener("change", () => filterTable(table));
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(resourceName));
    resourceCheckboxesDiv.appendChild(label);
    resourceCheckboxesDiv.appendChild(document.createElement("br"));
  });

  const table = document.createElement("table");
  const headerRow = table.insertRow();
  headerRow.insertCell().textContent = "Resource/Comment";
  componentNames.forEach(componentName => headerRow.insertCell().textContent = componentName);
  headerRow.insertCell().textContent = "Total";
  headerRow.classList.add('header-row');

  resourceNames.forEach(resourceName => {
    const row = table.insertRow();
    row.insertCell().textContent = resourceName;
    let resourceTotal = 0;
    componentNames.forEach(componentName => {
      const hours = resoursHours[resourceName][componentName] || 0;
      row.insertCell().textContent = hours.toFixed(2);
      resourceTotal += hours;
    });
    row.insertCell().textContent = resourceTotal.toFixed(2);
  });

  elements.resultDiv.appendChild(table);

  headerRow.querySelectorAll('td').forEach((cell, idx) => {
    cell.style.cursor = "pointer";
    cell.addEventListener("click", () => sortTableByColumn(table, idx));
  });

  document.getElementById("exportCsvBtn").addEventListener("click", () => exportTableToCSV(table, "resource_hours.csv"));

  function filterTable(table) {
    const checkedComponents = Array.from(document.querySelectorAll('#componentFilterCheckboxes input:checked')).map(cb => cb.value);
    const checkedResources = Array.from(document.querySelectorAll('#resourceFilterCheckboxes input:checked')).map(cb => cb.value);

    table.rows[0].querySelectorAll('td').forEach((cell, idx) => {
      if (idx > 0 && idx <= componentNames.length) {
        cell.style.display = checkedComponents.includes(cell.textContent) ? "" : "none";
      }
    });

    Array.from(table.rows).slice(1).forEach(row => {
      const resourceName = row.cells[0].textContent;
      row.style.display = checkedResources.includes(resourceName) ? "" : "none";
      let total = 0;
      row.querySelectorAll('td').forEach((cell, idx) => {
        if (idx > 0 && idx <= componentNames.length) {
          const componentName = table.rows[0].cells[idx].textContent;
          cell.style.display = checkedComponents.includes(componentName) ? "" : "none";
          if (checkedComponents.includes(componentName)) total += parseFloat(cell.textContent);
        }
      });
      row.cells[row.cells.length - 1].textContent = total.toFixed(2);
    });
  }

  function sortTableByColumn(table, columnIndex) {
    const rowsArray = Array.from(table.rows).slice(1);
    const sortedRows = rowsArray.sort((a, b) => {
      const cellA = a.cells[columnIndex].textContent;
      const cellB = b.cells[columnIndex].textContent;
      return columnIndex === 0 ? cellA.localeCompare(cellB) : parseFloat(cellB) - parseFloat(cellA);
    });
    sortedRows.forEach(row => table.tBodies[0].appendChild(row));
  }


}

  function exportTableToCSV(table, name) {
    let csv = [];
    Array.from(table.rows).forEach(row => {
      let cols = Array.from(row.cells).filter(cell => cell.style.display !== "none").map(cell => cell.textContent);
      if (row.style.display !== "none") csv.push(cols.join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
function buildTicketsPerUserTable() {
	elements.resultDiv.innerHTML = "<h2>User vs Tickets count</h2>";
    var ticketsPerUser = {};
	var startDate = new Date(elements.startDate.value);
	var endDate = new Date(elements.endDate.value);
	endDate.setHours(23, 59, 59, 999);
	var totalHours = 0;
	jiraJson.issues.forEach(function (issue) {
		var hours = 0;
		issue.fields.worklog.worklogs.forEach(function (worklog) {
			var resours = {};
			var worklogDate = new Date(worklog.started);
			if (worklogDate >= startDate && worklogDate <= endDate) {
				var name = worklog.author.displayName;
				if (!resours[name]) {
					resours[name] = hours;
					if (!ticketsPerUser[name]) {
						ticketsPerUser[name] = 1;
					} else {
						ticketsPerUser[name] += 1;
					}
				} 
			}
		});
	});

	var table = document.createElement("table");
	var headerRow = table.insertRow();
	var componentHeader = headerRow.insertCell(0);
	componentHeader.textContent = "User";
	var hoursHeader = headerRow.insertCell(1);
	hoursHeader.textContent = "Tickets Count";
	headerRow.classList.add('header-row')

	Object.keys(ticketsPerUser).forEach(function (componentName) {
		var row = table.insertRow();
		var componentCell = row.insertCell(0);
		componentCell.textContent = componentName;
		var hoursCell = row.insertCell(1);
		hoursCell.textContent = ticketsPerUser[componentName];
	});
	
	var row = table.insertRow();
	row.classList.add('total-row')
	var componentCell = row.insertCell(0);
	componentCell.textContent = "Total Hours";
	var hoursCell = row.insertCell(1);
	hoursCell.textContent = totalHours;
	
	//elements.resultDiv.appendChild(table);
	var ctxDiv = document.createElement("div");
	ctxDiv.classList.add("myChart");
	elements.resultDiv.appendChild(ctxDiv);
	
	var dataArray = [];
	for (var userName in ticketsPerUser) {
		if (userName != 'Mohammed Mansour' && userName != 'Luna Arandy' && userName != 'Ibrahim Dwaikat' ) {
		dataArray.push([userName, ticketsPerUser[userName]]);
		}
	}
		// Sort dataArray by the number of tickets per user
	dataArray.sort(function(a, b) {
		return b[1] - a[1];
	});
	google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'User');
		data.addColumn('number', 'Tickets Count');
		data.addRows(dataArray);
		var options = {
          pieSliceText: 'label' + 'percentage',
		  pieSliceTextStyle: {
			fontSize: '10',
          },

		};
		var chart = new google.visualization.PieChart(ctxDiv);
		chart.draw(data, options);
	}	
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
