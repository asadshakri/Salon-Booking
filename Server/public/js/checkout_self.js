const backend_url="http://13.235.74.25:7000";
document.getElementById("renderBtn").addEventListener("click", async() => {
    const cashfree = Cashfree({
        mode: "sandbox",
    });
    try{
        const token=localStorage.getItem("token");
        const appointmentId=localStorage.getItem("appointmentId");
      const response=await axios.post(`${backend_url}/pay`,{appointmentId},{ headers:{ "Authorization": token } })
      const paymentSessionId=response.data.paymentSessionId;
       console.log(paymentSessionId);
    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
    };
    await cashfree.checkout(checkoutOptions);
   // localStorage.removeItem("token");
}
catch(err)
{
    console.log(err);
}
});

window.opener.postMessage("READY", `${backend_url}`);

window.addEventListener("message", (event) => {
  console.log("Message received from:", event.origin);

  if (event.origin === `${backend_url}`) {
    localStorage.setItem("token", event.data.token);
    localStorage.setItem("appointmentId", event.data.appointmentId);
   
  }
});