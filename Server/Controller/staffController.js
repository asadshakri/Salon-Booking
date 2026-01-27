const Staff = require('../models/staff');
const Service = require('../models/service');
const StaffAvailability = require('../models/staffAvail');



const getStaffDetails=async (req, res) => {
    try{
    const staff = await Staff.findAll({
      include: [
        { model: Service }
      ]
    });
    res.json(staff);

}catch(err){
    res.status(500).json({ message: err.message });
}

    }

    module.exports={getStaffDetails};