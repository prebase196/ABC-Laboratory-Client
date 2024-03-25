document.addEventListener('DOMContentLoaded', function () {
    load_appointments();
});

function load_appointments(){
		
	const url = `http://localhost:9090/api/v1/appointments/user/${localStorage.getItem('userId')}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const appointmentTableBody = document.getElementById('appointment-table-body');
			
			//const new_tbody = document.createElement('tbody');
			//new_tbody.setAttribute("id", "appointment-table-body");
			
			//appointmentTableBody.parentNode.replaceChild(new_tbody, appointmentTableBody);
  

            data.forEach(appointment => {

	let dt = appointment.appointmentDate.split('T');

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.appointmentID}</td>
                    <td>${appointment.testType}</td>
                    <td>${dt[0]}</td>
                    <td>${appointment.appointmentTime}</td>
                    <td id="button-cell-${appointment.appointmentID}">
                        <button onclick="rescheduleAppointment(${appointment.appointmentID})">Pay</button>
                    </td>
                `;
                appointmentTableBody.appendChild(row);

                checkPaymentStatus(appointment.appointmentID);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function checkPaymentStatus(appointmentId) {
    const paymentUrl = `http://localhost:9090/api/v1/payments/${appointmentId}`;
    fetch(paymentUrl)
        .then(response => response.json())
        .then(paymentData => {
            if (paymentData.status === 'Paid') {
                const buttonCell = document.getElementById(`button-cell-${appointmentId}`);
                const payButton = buttonCell.querySelector('button');
                payButton.disabled = true;
                payButton.innerText = 'Paid';
                payButton.style.backgroundColor = 'red';
            }
        })
        .catch(error => {
            console.error('Error checking payment status:', error);
        });
}

function rescheduleAppointment(appointmentId) {
	
	let x = document.getElementById('paypal-button-container');
	
	if(x.innerHTML.trim() === ''){
		
		paypal.Buttons({
			createOrder: function(data, actions) {
				return actions.order.create({
					purchase_units: [{
						amount: {
							value: '10.00' 
						}
					}]
				});
			},
			onApprove: function(data, actions) {
				return actions.order.capture().then(function(details) {
					
					console.log('Payment successful:', details);
					////////////////////
					savePaymentDetails(details, appointmentId);
					
					document.getElementById('payment-success-message').style.display = 'block';

					document.getElementById('paypal-button-container').style.display = 'none';
				});
			},
			onError: function(err) {
				console.error('Payment error:', err);
			}
		}).render('#paypal-button-container');
	}
}

function cancelAppointment(appointmentId) {
    
}

function savePaymentDetails(paymentDetails, appointmentId) {
    
	const url = 'http://localhost:9090/api/v1/payments';
    const paymentData = {
        appointment: {
            appointmentID: appointmentId,
        },
        amount: paymentDetails.purchase_units[0].amount.value,
        paymentDate: new Date().toISOString(),
        paymentMethod: 'PayPal',
        status: 'Paid'
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
	
    .then(data => {
		
		
        console.log('Payment saved:', data);
		
        document.getElementById('payment-success-message').style.display = 'block';
        document.getElementById('paypal-button-container').style.display = 'none';
		
		
    })
    .catch(error => {
        console.error('Error saving payment:', error);
    });
	
}