function logout(){
    localStorage.removeItem("token");
    window.location.href = "/admin/main.html";
}

function convertTo24Hr(time) {
    time = time.toLowerCase();
  
    let hour = parseInt(time);
    if (time.includes("pm") && hour !== 12) hour += 12;
    if (time.includes("am") && hour === 12) hour = 0;
  
    return `${hour.toString().padStart(2, "0")}:00`;
  }
  
  function formatTime(time) {
    let hour = parseInt(time.split(":")[0]);
    const suffix = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour} ${suffix}`;
  }


  document.getElementById("addServiceBtn").addEventListener("click", () => {
    const popup = document.createElement("div");
    popup.className = "popup";
  
    popup.innerHTML = `
      <div class="popup-content">
        <span id="closeBtn">&times;</span>
  
        <h4>Add Service</h4>
  
        <input id="serviceName" class="form-control mb-2" placeholder="Service Name">
        <input id="serviceDesc" class="form-control mb-2" placeholder="Description">
        <input id="serviceDuration" class="form-control mb-2" placeholder="Duration">
        <input id="servicePrice" class="form-control mb-3" type="number" placeholder="Price">
  
        <hr>
        <h6>Available Days</h6>
  
        <div class="d-flex gap-2 mb-2">
          <select id="slotDay" class="form-select">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
  
          <button id="addDayBtn" class="btn btn-outline-primary">➕</button>
        </div>
  
        <div id="daySlotList" class="mb-2"></div>
  
        <button id="createService" class="btn btn-success w-100 mt-2">
          Add Service
        </button>
      </div>
    `;
  
    document.body.appendChild(popup);
  
    const selectedDays = new Set();
  
    const closeBtn = popup.querySelector("#closeBtn");
    const addDayBtn = popup.querySelector("#addDayBtn");
    const slotDay = popup.querySelector("#slotDay");
    const daySlotList = popup.querySelector("#daySlotList");
    const createService = popup.querySelector("#createService");
  
    closeBtn.onclick = () => popup.remove();
  
    const renderDays = () => {
      daySlotList.innerHTML = "";
      [...selectedDays].forEach(day => {
        const div = document.createElement("div");
        div.className = "badge bg-secondary me-2 mb-1";
        div.textContent = day;
        daySlotList.appendChild(div);
      });
    };
  
    addDayBtn.onclick = () => {
      selectedDays.add(slotDay.value);
      renderDays();
    };
  
    createService.onclick = async () => {
      const token = localStorage.getItem("adminToken");
  
      if (selectedDays.size === 0) {
        alert("Please select at least one day");
        return;
      }
  
      // 1️⃣ Create service
      const serviceRes = await axios.post(
        "http://localhost:4000/admin/salon/service",
        {
          serviceName: serviceName.value,
          serviceDesc: serviceDesc.value,
          serviceDuration: serviceDuration.value,
          servicePrice: servicePrice.value
        },
        { headers: { Authorization: token } }
      );
  
      const serviceId = serviceRes.data.serviceId;
  
      // 2️⃣ Send ONLY DAYS
      await axios.post(
        "http://localhost:4000/admin/salon/serviceAvailability",
        {
          serviceId,
          days: [...selectedDays]
        },
        { headers: { Authorization: token } }
      );
  
      alert("Service added successfully");
      popup.remove();
    };
  
    function render() {
      daySlotList.innerHTML = "";
      for (const day in availability) {
        daySlotList.innerHTML += `
          <div class="border p-2 mb-1">
            <strong>${day}</strong> : ${availability[day].map(formatTime).join(", ")}
          </div>
        `;
      }
    }
  });
  
  function convertTo24Hr(time) {
    time = time.toLowerCase();
    let hour = parseInt(time);
    if (time.includes("pm") && hour !== 12) hour += 12;
    if (time.includes("am") && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:00`;
  }
  
  function formatTime(time) {
    let h = parseInt(time);
    const ampm = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h} ${ampm}`;
  }

  const addstaff=document.getElementById("addStaffBtn")

  addstaff.addEventListener("click", async () => {
    const services = await axios.get("http://localhost:4000/salon/services");
  
    const popup = document.createElement("div");
    popup.className = "popup";
  
    popup.innerHTML = `
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      <h4>Add Staff</h4>
  
      <input id="names" class="form-control mb-2" placeholder="Name" />
      <input id="email" class="form-control mb-2" placeholder="Email" />
      <input id="phone" class="form-control mb-2" placeholder="Phone" />
      <input id="spec" class="form-control mb-3" placeholder="Specialization" />
  
      <h6>Assign Services</h6>
      ${services.data.services.map(s => `
        <div>
          <input type="checkbox" value="${s.id}" class="serviceChk" /> ${s.serviceName}
        </div>
      `).join("")}
  
      <hr/>
  
      <h6>Availability</h6>
      <input id="times" class="form-control mb-3" placeholder="4pm,6pm" />
  
      <button class="btn btn-success w-100" id="saveStaff">Save Staff</button>
    </div>`;
  
    document.body.appendChild(popup);
  
    popup.querySelector(".close-btn").onclick = () => popup.remove();
  
    document.getElementById("saveStaff").onclick = async () => {
      const servicesSelected = [...document.querySelectorAll(".serviceChk:checked")]
        .map(i => i.value);
  
      const availability = document.getElementById("times").value
        .split(",")
        .map(t => ({
          time: convertTo24Hr(t.trim())
        }));
  
      await axios.post("http://localhost:4000/admin/post", {
        name: names.value,
        email: email.value,
        phone: phone.value,
        specialization: spec.value,
        services: servicesSelected,
        availability
      });
  
      alert("Staff added successfully");
      popup.remove();

    };
  });

  document.getElementById("viewBookingsBtn").addEventListener("click", () => {
    window.location.href = "/adminSalon/bookings.html";
  });