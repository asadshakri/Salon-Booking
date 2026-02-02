const backendUrl="http://13.235.74.25";

function customerPage(){
    window.location.href = "/user/main.html";
}

function loginAdmin(event){
    event.preventDefault();
    const email=event.target.email.value;
    const password=event.target.passwd.value;
    const adminDetails={email,password};
    const span=document.getElementById("message");
    span.innerHTML="";
    axios.post(`${backendUrl}/admin/login`,adminDetails).then((response)=>{
      alert(response.data.message);
      localStorage.setItem("adminToken",response.data.token);
      window.location.href="../adminSalon/main.html";
    }).catch((error)=>{
      if(error.response.status=="404" || error.response.status=="401")
      {
         span.innerHTML=`${error.response.data.message}`
         span.style.color="red";
      }
    })

}