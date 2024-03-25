document.addEventListener('DOMContentLoaded', function () {
    
    fetch('http://localhost:9090/api/v1/users')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('user-id');

           
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.fullname;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const reportForm = document.getElementById('report-form');

    reportForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const userId = document.getElementById('user-id').value;
        const file = document.getElementById('fileupload').files[0]; 

        let formData = new FormData(); 
        formData.append("userId", userId);
        formData.append("file", file);

        fetch('http://localhost:9090/api/v1/reports/upload', {
            method: "POST", 
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Report saved successfully');
                
            } else {
                console.error('Failed to save report');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

// report view
document.addEventListener('DOMContentLoaded', function () {
    const reportTableBody = document.getElementById('report-table-body');
    const reportViewer = document.getElementById('report-viewer');
    const reportIframe = document.getElementById('report-iframe');
    const closeViewerButton = document.getElementById('close-viewer');

    
    function fetchReports() {
        fetch('http://localhost:9090/api/v1/reports')
            .then(response => response.json())
            .then(data => {
                
                reportTableBody.innerHTML = '';

                data.forEach(report => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${report.reportID}</td>
                        <td>${formatDate(report.reportDate)}</td>
                        <td>
                            <button class="view-report" data-report-url="${report.reportFilePath}">View</button>
                        </td>
                    `;
                    reportTableBody.appendChild(row);
                });

                const viewReportButtons = document.querySelectorAll('.view-report');
                viewReportButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const reportUrl = this.getAttribute('data-report-url');
                        showReport(reportUrl);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
            });
    }

    function showReport(reportUrl) {
        reportIframe.src = reportUrl;
        reportViewer.classList.remove('hidden');
    }


    closeViewerButton.addEventListener('click', function () {
        reportViewer.classList.add('hidden');
        reportIframe.src = ''; 
    });

    fetchReports();
});

function formatDate(dateString) {
    
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

