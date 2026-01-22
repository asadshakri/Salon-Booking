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
    const popUpDiv = document.createElement("div");
    popUpDiv.classList.add("popup");
  
    popUpDiv.innerHTML = `
      <div class="popup-content">
        <span class="close-btn" id="closeBtn">&times;</span>
  
        <h4>Add Service</h4>
  
        <input class="form-control mb-2" id="serviceName" placeholder="Service Name" />
        <input class="form-control mb-2" id="serviceDesc" placeholder="Description" />
        <input class="form-control mb-2" id="serviceDuration" placeholder="Duration (30 mins)" />
        <input class="form-control mb-3" id="servicePrice" type="number" placeholder="Price" />
  
        <hr />
        <h6>Availability Slots</h6>
  
        <div class="d-flex gap-2 mb-2">
          <select class="form-select" id="slotDay">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
  
          <input
            class="form-control"
            id="slotTimes"
            placeholder="4pm,6pm,7pm"
          />
  
          <button class="btn btn-outline-primary" id="addDayBtn">➕</button>
        </div>
  
        <div id="daySlotList" class="mb-3"></div>
  
        <button class="btn btn-success w-100" id="createService">
          Add Service
        </button>
      </div>
    `;
  
    document.body.appendChild(popUpDiv);
  
    const availabilityMap = {}; // { Monday: ["16:00","18:00"] }
  
    document.getElementById("closeBtn").onclick = () => popUpDiv.remove();
  
    // ➕ Add Day
    document.getElementById("addDayBtn").onclick = () => {
      const day = slotDay.value;
      const timesRaw = slotTimes.value.trim();
  
      if (!timesRaw) return alert("Enter slot times");
  
      const times = timesRaw.split(",").map(t => convertTo24Hr(t.trim()));
  
      availabilityMap[day] = times; // overwrite if day already exists
  
      renderDaySlots(availabilityMap);
      slotTimes.value = "";
    };
  
    // ✅ Create Service + Slots
    document.getElementById("createService").onclick = async () => {
      const token = localStorage.getItem("adminToken");
  
      // 1️⃣ Create Service
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
  
      // 2️⃣ Create Slots for ALL days
      for (const day in availabilityMap) {
        await axios.post(
          "http://localhost:4000/admin/service/slots",
          {
            serviceId,
            day,
            times: availabilityMap[day]
          },
          { headers: { Authorization: token } }
        );
      }
  
      alert("Service & availability added");
      popUpDiv.remove();
      window.location.reload();
    };
  
    // 🔁 Render UI
    function renderDaySlots(map) {
      const container = document.getElementById("daySlotList");
      container.innerHTML = "";
  
      for (const day in map) {
        const times = map[day]
          .map(t => formatTime(t))
          .join(", ");
  
        container.innerHTML += `
          <div class="border rounded p-2 mb-1 d-flex justify-content-between">
            <strong>${day}</strong>
            <span>${times}</span>
          </div>
        `;
      }
    }
  });