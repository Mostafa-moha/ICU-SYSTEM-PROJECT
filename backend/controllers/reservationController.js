const Reservation = require('../models/Reservation');
const ICURoom = require('../models/ICURoom');  // ICU Room model
const Patient = require('../models/Patient');  // Patient model

// Create a new reservation
exports.createReservation = async (req, res) => {
  const { patientID, roomID } = req.body;
  
  // Validate missing data
  if (!patientID || !roomID) {
    return res.status(400).json({ error: 'Missing required fields for reservation' });
  }
  
  try {
    const room = await ICURoom.findByPk(roomID);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the room is available
    if (room.occupancyStatus) {
      return res.status(400).json({ message: 'Room already occupied' });
    }

    // Calculate entry and exit time (30 minutes after entry)
    const entryTime = new Date();
    const exitTime = new Date(entryTime.getTime() + 30 * 60000); // 30 minutes later

    // Create the reservation
    const reservation = await Reservation.create({
      patientID,
      roomID,
      reservationStatus: 'pending', // Room is pending until confirmed
      entryTime,
      exitTime
    });

    // Update the room's occupancy status
    await room.update({ occupancyStatus: true });

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation,
      entryTime,
      exitTime
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to create reservation' });
  }
};

// Cancel a reservation
exports.cancelReservation = async (req, res) => {
  const { reservationID } = req.params;
  try {
    const reservation = await Reservation.findByPk(reservationID);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Set room's occupancy status to false (available)
    const room = await ICURoom.findByPk(reservation.roomID);
    await room.update({ occupancyStatus: false });

    // Delete the reservation
    await reservation.destroy();

    res.json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to cancel reservation' });
  }
};

// Submit a reservation (Confirm reservation)
exports.submitReservation = async (req, res) => {
  const { reservationID } = req.params;
  try {
    const reservation = await Reservation.findByPk(reservationID);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Update reservation status to 'submitted' (confirmed)
    reservation.reservationStatus = 'submitted';
    await reservation.save();

    res.json({ message: 'Reservation confirmed successfully', reservation });
  } catch (error) {
    res.status(500).json({ error: 'Unable to submit reservation' });
  }
};

// Get reservation details for a specific patient
exports.getReservationDetails = async (req, res) => {
  const { reservationID } = req.params;
  try {
    const reservation = await Reservation.findByPk(reservationID);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Fetch associated patient and room details
    const patient = await Patient.findByPk(reservation.patientID);
    const room = await ICURoom.findByPk(reservation.roomID);

    res.json({
      reservation,
      patient,    // Patient details (name, condition, etc.)
      room,       // Room details (room number, type, etc.)
      entryTime: reservation.entryTime,
      exitTime: reservation.exitTime,
      fees: room.fees, // The fees for the ICU room
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch reservation details' });
  }
};

// Get all reservations for admin (to see the status of all rooms and patient details)
exports.getAllReservationsForAdmin = async (req, res) => {
  try {
    // Join Reservation with Patient and ICURoom to get the complete data
    const reservations = await Reservation.findAll({
      include: [
        { model: Patient },  // Include patient details
        { model: ICURoom },  // Include ICU room details
      ]
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch reservations for admin' });
  }
};

  
