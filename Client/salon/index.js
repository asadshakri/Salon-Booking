

const backend_url="http://localhost:4000";

async function showProfile(){
    const profileSection = document.getElementById('profileSection');
    profileSection.style.display = 'flex';
    document.getElementById("serviceSection").style.display='none';
    document.getElementById("changePasswordSection").style.display='none';
    document.getElementById("updateProfile").style.display='block';
   
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
        serviceSection.style.display = "block";
      
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:4000/salon/services-with-availability",
          { headers: { Authorization: token } }
        );
      
        serviceList.innerHTML = "";
      
        res.data.services.forEach(service => {
          const div = document.createElement("div");
          div.className = "card p-3 m-2";
      
          const availability = service.ServiceAvailabilities
            .map(a => `${a.dayOfWeek}: ${a.startTime} - ${a.endTime}`)
            .join("<br>");
      
          div.innerHTML = `
            <h5>${service.serviceName}</h5>
            <p>${service.serviceDescription}</p>
            <p><strong>Availability:</strong><br>${availability}</p>
            <button class="btn btn-primary">View Staff</button>
          `;
      
          div.querySelector("button").onclick = () =>
            loadStaffForService(service.id);
      
          serviceList.appendChild(div);
        });
      }



