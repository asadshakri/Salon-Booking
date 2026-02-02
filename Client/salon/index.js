const backend_url="http://13.235.74.25";

window.addEventListener('DOMContentLoaded',()=>{
  const token = localStorage.getItem('token');
  if(!token){
    alert("Please login to access your profile");
    window.location.href="../user/main.html";
  }
  selectService();
 
});

async function showProfile(){
    const profileSection = document.getElementById('profileSection');
    profileSection.style.display = 'flex';
    document.getElementById("serviceSection").style.display='none';
    document.getElementById("changePasswordSection").style.display='none';
    document.getElementById("updateProfile").style.display='block';
    document.getElementById("staffSection").style.display='none';
    document.getElementById("bookingSection").style.display='none';
    document.getElementById("selectServiceSection").style.display='none';
   
    const token = localStorage.getItem('token');
    const resultDetails= await axios.get(`${backend_url}/user/profile`,{ headers:{"authorization":token}});
    document.getElementById('name').value=resultDetails.data.name;
    document.getElementById('email').value=resultDetails.data.email;
    document.getElementById('phone').value=resultDetails.data.phone;
    document.getElementById('address').value=resultDetails.data.address;

    document.getElementById("profileForm").addEventListener("submit",(event)=>{
        event.preventDefault();
        const name=event.target.name.value;
        const phone=event.target.phone.value;
        const email=event.target.email.value;
        const address=event.target.address.value;
        const updatedDetails={name,email,phone,address};
        const token = localStorage.getItem('token');
        axios.patch(`${backend_url}/user/updateProfile`,updatedDetails,{ headers:{"authorization":token}}).then((response)=>{
            alert(response.data.message);
    
        }).catch((error)=>{
            console.log(error);
        })
    });

    document.getElementById("changePasswordBtn").addEventListener("click",()=>{
        document.getElementById("updateProfile").style.display='none';
        document.getElementById("changePasswordSection").style.display='block';
       document.getElementById("changePasswordForm").addEventListener("submit",(event)=>{
        event.preventDefault();
        const oldPassword=event.target.currentPassword.value;
        const newPassword=event.target.newPassword.value;
        const passwordDetails={oldPassword,newPassword};
        const token = localStorage.getItem('token');
        axios.patch(`${backend_url}/user/changePassword`,passwordDetails,{ headers:{"authorization":token}}).then((response)=>{
            alert(response.data.message);
            document.getElementById("changePasswordSection").style.display='none';
            document.getElementById("updateProfile").style.display='block';
    
        }).catch((error)=>{
            alert(error.response.data.message);
            console.log(error);
        })
       });
    });

   document.getElementById("deleteUserBtn").addEventListener("click",()=>{
    const confirmation=confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if(confirmation){
        const token = localStorage.getItem('token');
        axios.delete(`${backend_url}/user/deleteUser`,{ headers:{"authorization":token}}).then((response)=>{
            alert(response.data.message);
            localStorage.removeItem("token");
            window.location.href="../user/main.html";
    
        }).catch((error)=>{
            console.log(error);
        })
    }
   });

}

function logout(){
    localStorage.removeItem("token");
    window.location.href="../user/main.html";
}



    async function showService() {
        profileSection.style.display = "none";
        serviceSection.style.display = "flex";
        document.getElementById("staffSection").style.display = "none";
        document.getElementById("selectServiceSection").style.display = "none";
        document.getElementById("bookingSection").style.display = "none";
      
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${backend_url}/salon/services`,
          { headers: { Authorization: token } }
        );
        const serviceList = document.getElementById("serviceList");
        serviceList.innerHTML = "";
      
        res.data.services.forEach(service => {
      
          serviceList.innerHTML += `
            <div class="service-item p-3 mb-3">
              <h4>${service.serviceName}</h4>
              <p>${service.serviceDescription}</p>
              <p>Duration: ${service.serviceDuration} mins</p>
              <p>Price: $${service.servicePrice}</p>
           

            </div>
          `;
        });
      }
      
    

      async function staffDetails() {

        document.getElementById("profileSection").style.display = "none";
        document.getElementById("serviceSection").style.display = "none";
        document.getElementById("staffSection").style.display = "flex";
        document.getElementById("selectServiceSection").style.display = "none";
        document.getElementById("bookingSection").style.display = "none";

        const res = await axios.get(`${backend_url}/staff/get`);
        const container = document.getElementById("staffList");
        container.innerHTML = "";
      
        res.data.forEach(staff => {
          container.innerHTML += `
            <div class="service-item p-3 mb-2">
              <h4>${staff.name}</h4>
              <p><b>Specialization:</b> ${staff.specialization}</p>
              <p><b>Contact:</b> ${staff.email} | ${staff.phone}</p>
              <p><b>Services:</b>
                ${staff.services.map(s => s.serviceName).join(", ")}
              </p>
            </div>
          `;
        });
      }


      async function selectService() {
     
   document.getElementById("profileSection").style.display = "none";
    document.getElementById("serviceSection").style.display = "none";
    document.getElementById("staffSection").style.display = "none";
    document.getElementById("selectServiceSection").style.display = "block";
    document.getElementById("bookingSection").style.display = "none";
        const res = await axios.get(`${backend_url}/salon/services`);
      
        serviceSelect.innerHTML = "";
        res.data.services.forEach(s => {
          serviceSelect.innerHTML += `
            <option value="${s.id}">
              ${s.serviceName} - ₹${s.servicePrice}
            </option>
          `;
        });
      }

      async function searchSlots() {
      
        try{
        const serviceId = serviceSelect.value;
        const date = new Date(bookingDate.value);
        const current_date = new Date();

        if (date < current_date) {
          alert("Please select a valid date.");
          return;
        }
       
        const res = await axios.get(`${backend_url}/booking/availableSlots?serviceId=${serviceId}&date=${date}`
        );
      
        const slotsDiv = document.getElementById("slots");
        slotsDiv.innerHTML = "";
      
        if (res.data.length === 0) {
          slotsDiv.innerHTML = "<p>No slots available</p>";
          return;
        }
      
        res.data.forEach(s => {
          slotsDiv.innerHTML += `
            <button onclick="bookSlot(${serviceId},${s.staffId},'${date}','${s.time}','${s.staffName}')" class="btn btn-primary m-2">
              ${s.time} — ${s.staffName}
            </button>
          `;
        });
      }
      catch(error){
        console.log("Error fetching slots:", error);
      }
    }
      async function bookSlot(serviceId, staffId, date, time, staffName) {
        const token = localStorage.getItem("token");
    try{
    
      const currDate=new Date();
      if(new Date(date).toDateString()===currDate.toDateString()){
        const [hours, minutes] = time.split(":").map(Number);
        if(hours<currDate.getHours() || (hours===currDate.getHours() && minutes<=currDate.getMinutes())){
          alert("Please select a valid time slot.");
          return;
        }
      }

       const book= await axios.post(`${backend_url}/booking/createBooking`, {
          customerName: custName.value,
          customerPhone: custPhone.value,
          serviceId,
          staffId,
          date,
          time,
          staffName
        },
        { headers:{"authorization":token}}
        );

         localStorage.setItem("appointmentId",book.data.appointmentId);
         localStorage.setItem("servicePrice",book.data.servicePrice);
         const appointmentId=localStorage.getItem("appointmentId");
        const popup = window.open(`${backend_url}/paymentPage`, "payment");
      
        window.addEventListener("message", (event) => {
          if (event.origin === `${backend_url}` && event.data === "READY") {
         
            popup.postMessage({ token,appointmentId }, `${backend_url}`);
          }
        });
      }
      catch(error){
        if(error.response.data && error.response.data.message==="Slot already booked"){
          alert("Sorry this slot has just been booked by someone else. Please choose another slot.");
        }
        else{
        console.log("Error booking slot:", error);
        }

      }}


    async  function showBooking(){
        
        document.getElementById("profileSection").style.display = "none";
        document.getElementById("serviceSection").style.display = "none";
        document.getElementById("staffSection").style.display = "none";
        document.getElementById("selectServiceSection").style.display = "none";
        document.getElementById("bookingSection").style.display = "flex";


          try {
            const response = await axios.get(
              `${backend_url}/booking/getBookings`,
              {
                headers: {
                  "authorization": localStorage.getItem("token")
                }
              }
            );
        
            const bookingList = document.getElementById("bookingList");
            bookingList.innerHTML = "";
            console.log(response.data);
              response.data.bookings.forEach(booking => {
              bookingList.innerHTML += `
                <div class="service-item p-3 mb-3">
                  <h4>Appointment ID: ${booking.id}</h4>
                  <p>Service ID: ${booking.serviceId}</p>
                  <p>Staff Name: ${booking.staffName}</p>
                  <p>Date: ${booking.date}</p>
                  <p>Time: ${booking.time}</p>
                  <p>Status: ${booking.status}</p>
                     <button id="cancelApp"  class="btn btn-primary" onclick="cancelAppointment(${booking.id})">Cancel</button>
                     <button id="reschedule"  class="btn btn-secondary" onclick="rescheduleAppointment(${booking.id},${booking.serviceId})">Reschedule</button>
                </div>
              `;
              if(new Date().toISOString().split('T')[0]>booking.date){
                document.getElementById("cancelApp").style.display="none";
                document.getElementById("reschedule").style.display="none";
              }
            });

         
          } catch (err) {
            console.log(err);
            alert("Failed to load bookings");
          }
        }

        async function cancelAppointment(appointmentId){
          const confirmation=confirm("Are you sure you want to cancel this appointment?");
          if(confirmation){
          try{
            const token = localStorage.getItem("token");
            const response=await axios.delete(`${backend_url}/booking/cancelBooking/${appointmentId}`,{ headers:{"authorization":token}});
            alert(response.data.message);
            showBooking();
          }
          catch(error){
            console.log(error);
            alert("Failed to cancel appointment");
          }
        }
        }

        async function rescheduleAppointment(appointmentId,serviceId){
          

          const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
      <div class="popup-content p-4">
        <h3>Reschedule Appointment</h3>
        <label for="newDate">Select New Date:</label>
        <input type="date" id="newDate" name="newDate" class="form-control mb-3" />
        <button id="viewSlotsBtn" class="btn btn-info w-100 mt-2" >View Slots</button>">
        <div id="slotsD" class="mt-3"></div>
        <button id="closeBtn" class="btn btn-danger w-100 mt-2">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(popup);
    document.getElementById("viewSlotsBtn").onclick = () => {
      const selectedDate = document.getElementById("newDate").value;
    
      if (!selectedDate) {
        alert("Please select a date");
        return;
      }
    
      searchNewSlots(selectedDate, serviceId, appointmentId);
    };
    const closeBtn = popup.querySelector("#closeBtn");
    closeBtn.onclick = () => {
          popup.remove();
    };


        }
        async function searchNewSlots(Bdate,serviceId,appointmentId) {
      
          try{
          const date = new Date(Bdate);
          const current_date = new Date(); 
          if (date < current_date) {
            alert("Please select a valid date.");
            return;
          }
         
          const res = await axios.get(`${backend_url}/booking/availableSlots?serviceId=${serviceId}&date=${date}`
          );
        
          const slotsDiv = document.getElementById("slotsD");
          slotsDiv.innerHTML = "";
        
          if (res.data.length === 0) {
            slotsDiv.innerHTML = "<p>No slots available</p>";
            return;
          }
        
          res.data.forEach(s => {
            slotsDiv.innerHTML += `
              <button onclick="bookNewSlot(${serviceId},${s.staffId},'${date}','${s.time}','${s.staffName}',${appointmentId})" class="btn btn-primary m-2">
                ${s.time} — ${s.staffName}
              </button>
            `;
          });
        }
        catch(error){
          console.log("Error fetching slots:", error);
        }
      }

      async function bookNewSlot(serviceId, staffId, date, time, staffName, appointmentId) {
        const token = localStorage.getItem("token");
    try{
    
      const currDate=new Date();
      if(new Date(date).toDateString()===currDate.toDateString()){
        const [hours, minutes] = time.split(":").map(Number);
        if(hours<currDate.getHours() || (hours===currDate.getHours() && minutes<=currDate.getMinutes())){
          alert("Please select a valid time slot.");
          return;
        }
      }

       const book= await axios.patch(`${backend_url}/booking/rescheduleBooking/${appointmentId}`, {
          serviceId,
          staffId,
          date,
          time,
          staffName
        },
        { headers:{"authorization":token}}
        );

         alert(book.data.message);
         document.querySelector(".popup").remove();
         showBooking();
      }
      catch(error){
        if(error.response.data && error.response.data.message==="Slot already booked"){
          alert("Sorry, this slot has just been booked by someone else. Please choose another slot.");
        }
        else{
        console.log("Error booking slot:", error);
        }

      }}
