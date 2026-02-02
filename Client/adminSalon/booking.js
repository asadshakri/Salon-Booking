const backendUrl="http://13.235.74.25:7000";

window.onload = async function() {
    try{
    const response = await axios.get(
        `${backendUrl}/booking/getBookings`,
        {
          headers: {
            "authorization": localStorage.getItem("adminToken")
          }
        }
      );
  
      const bookingList = document.getElementById("bookingList");
      bookingList.innerHTML = "";
      console.log(response.data);
        response.data.bookings.forEach(booking => {
        bookingList.innerHTML += `
          <div class="service-item p-3 mb-3 border">
            <h4>Appointment ID: ${booking.id}</h4>
            <p>Service ID: ${booking.serviceId}</p>
            <p>Staff Name: ${booking.staffName}</p>
            <p>Date: ${booking.date}</p>
            <p>Time: ${booking.time}</p>
            <p>Client Id: ${booking.customerId}</p>
            <p>Status: ${booking.status}</p>
        `;
      });  
    } catch (err) {
      console.log(err);
      alert("Failed to load bookings");
    }
  }
