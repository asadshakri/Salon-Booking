  **Salon Appointment Booking System – API Documentation**

Built a salon appointment booking system with JWT-based authentication, service and staff management, and date-based appointments. Services are available by day, staff provide time slots, and users can book appointments for specific dates. Payments are handled via Cashfree, with bookings confirmed only after successful payment. Automated email notifications send booking confirmations.

**Tech Stack**

1. Backend \- [Node.js](http://Node.js) ([Express.js](http://Express.js))  
2. Frontend \- HTML, CSS, JavaScript  
3. Database \- MySQL (ORM- Sequelize)

**API ENDPOINTS**

1. **User Profiles Routes:**

### **➤ Register User**

POST /user/add

**Body**

`{`

  `"name": "Asad",`

  `"email": "asad@gmail.com",`

  `"phone": "9876543210",`

  `"password": "password123",`

  `"address": "Patna"`

`}`

### 

### 

### **➤ Login User**

POST `/user/login`

**Body**

`{`

  `"emailOrPhone": "asad@gmail.com",`

  `"password": "password123"`

`}`

### **`➤` Get Profile**

`GET /user/profile`

**`Response`**

`{`

  `"name": "Asad",`

  `"email": "asad@gmail.com",`

  `"phone": "9876543210",`

  `"address": "Patna"`

`}`

### 

### 

### 

### 

### 

### **`➤` Update Profile**

`PATCH /user/updateProfile`

**`Body`**

`{`

  `"name": "AsadS",`

  `"phone": "9999999999",`

  `"address": "Delhi"`

`}`

### **`➤`  Delete Profile**

`DELETE`  / user / deleteUser

### **`➤` Change Password**

PATCH   / user / changePassword

2. **Service Routes:**

### **➤ Get All Services**

GET `/salon/services`

Response

`{`  
  `"services": [`  
    `{`  
      `"id": 1,`  
      `"serviceName": "Haircut",`  
      `"serviceDuration": "45 mins",`  
      `"servicePrice": 500`  
    `}`  
  `]`  
`}`

3. **Staff Routes:**

### **➤ Get Staff Details**

GET `/staff/get`

Response

`[`  
  `{`  
    `"id": 1,`  
    `"name": "xyz",`  
    `"specialization": "Haircut",`  
    `"services": [...],`  
    `"StaffAvails": [...]`  
  `}`  
`]`

4. **`Booking Routes:`**

**➤ Get Available Slots**

GET /booking/availableSlots

**`Query Params`**

`serviceId=1`  
`date=2026-01-26`

**`Response`**

`[`  
  `{`  
    `"date": "2026-01-26",`  
    `"day": "Monday",`  
    `"time": "10:00",`  
    `"staffId": 1,`  
    `"staffName": "xyz"`  
  `}`  
`]`

### **➤ Create Appointment**

POST /booking/createBooking

**Body**

`{`  
  `"customerName": "Asad",`  
  `"customerPhone": "9999999999",`  
  `"serviceId": 8,`  
  `"staffId": 1,`  
  `"date": "2026-01-26",`  
  `"time": "10:00"`  
`}`

### **➤ Get User Bookings**

**GET** /booking/getBookings

**Response**

`{`  
  `"bookings": [`  
    `{`  
      `"id": 12,`  
      `"serviceId": 1,`  
      `"staffName": "John",`  
      `"date": "2026-01-26",`  
      `"time": "10:00",`  
      `"status": "BOOKED"`  
    `}`  
  `]`  
`}`

### **➤ Cancel Booking**

DELETE  /booking/cancelBooking/:bookingId

### **➤ Reschedule Booking**

PATCH   /booking/rescheduleBooking/:bookingId

5. **Payment Routes:**

### **➤ Payment Page**

GET   /paymentPage

### **➤ Pay Payment**

POST   /pay

### **➤ Payment Status**

GET    /payment-status/:orderId

**Response**

`{`  
  `"orderStatus": "Success",`  
  `"orderId": "ORDER-1769423610120"`  
`}`

6. **`Admin Routes:`**

### **➤ Admin Login**

POST /admin/login

**`Body`**

`{`  
  `"email": "asadshakri@email.com",`  
  `"password": "admin123"`  
`}`

### **➤ Add Salon Service**

POST /admin/salon/service

**Body**

`{`  
  `"serviceName": "Haircut",`  
  `"serviceDesc": "Men haircut",`  
  `"serviceDuration": "45 mins",`  
  `"servicePrice": 500`  
`}`

### **➤ Set Service Available Days**

POST /admin/salon/serviceAvailability

**`Body`**

`{`  
  `"serviceId": 1,`  
  `"day": "Monday"`  
`}`

### **➤ Add Staff**

POST /admin/post

**Body**

`{`  
  `"name": "asd",`  
  `"email": "asd@gmail.com",`  
  `"phone": "8888888888",`  
  `"specialization": "Haircut",`  
  `"services": [1],`  
  `"availability": [`  
    `{ "day": "Monday", "time": "10:00" },`  
    `{ "day": "Monday", "time": "11:00" }`  
  `]`  
`}`
