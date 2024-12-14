const { ICURoom } = require('../models/ICURoom');

// ADMIN: Add ICU Room
exports.addICURoom = async (req, res) => {
  const { hospitalID, roomNumber, specialization, occupancyStatus } = req.body;
  
  // Validate missing data
  if (!hospitalID || !roomNumber || !specialization || typeof occupancyStatus === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields for ICU Room' });
  }
  
  
  try {
    const room = await ICURoom.create({ hospitalID, roomNumber, specialization, occupancyStatus });
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to add ICU Room' });
  }
};

// ADMIN: Update ICU Room
exports.updateICURoom = async (req, res) => {
  const { roomID } = req.params;
  const { hospitalID, roomNumber, specialization, occupancyStatus } = req.body;

  try {
    const room = await ICURoom.findByPk(roomID);
    if (!room) {
      return res.status(404).json({ error: 'ICU room not found' });
    }

    room.hospitalID = hospitalID;
    room.roomNumber = roomNumber;
    room.specialization = specialization;
    room.occupancyStatus = occupancyStatus;

    await room.save();
    res.json({ message: 'ICU room updated successfully', room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update ICU room' });
  }
};

// ADMIN: Delete ICU Room
exports.deleteICURoom  = async (req, res) => {
  const { roomID } = req.params;
  try {
    const room = await ICURoom.findByPk(roomID);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    await room.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete ICU room' });
  }
};

exports.markAsOccupied = async (req, res) => {
  const { roomID, patientID } = req.body;
  try {
    await ICURoom.update({ occupancyStatus: true, patientID }, { where: { roomID } });
    res.json({ message: 'Room marked as occupied' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark room as occupied' });
  }
};

exports.markAsAvailable = async (req, res) => {
  const { roomID } = req.params;
  try {
    await ICURoom.update({ occupancyStatus: false, patientID: null }, { where: { roomID } });
    res.json({ message: 'Room marked as available' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark room as available' });
  }
};


// List available ICU rooms
exports.checkAvailability = async (req, res) => {
  const { hospitalID, specialization } = req.query;
  try {
    const availableRooms = await ICURoom.findAll({
      where: { hospitalID, specialization, occupancyStatus: false },
    });
    res.json(availableRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch ICU room availability' });
  }
};
