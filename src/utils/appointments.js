function getSlots(doctorAvailability) {
    //[{day, startTime, endTime}]
    let slots = [];
    console.log(doctorAvailability)
    for(let i = 0; i<doctorAvailability.length; i++){
            let time = doctorAvailability[i];
            let day = time.day;
            
            const startDate = new Date(`2023-01-01T${time.startTime.length == 5? time.startTime:"0"+time.startTime}`);
            const endDate = new Date(`2023-01-01T${time.endTime.length == 5? time.endTime:"0"+time.endTime}`);
            // Calculate the duration between start and end times in milliseconds
            const duration = endDate - startDate;
        
            // If the duration is less than or equal to 30 minutes, create a single slot
            if (duration <= 30 * 60 * 1000) {
            slots.push({
                day:day,
                startTime: time.startTime,
                endTime: time.endTime,
            });
            } else {
            // Otherwise, create slots in 30-minute intervals
            let current = startDate;
            while (current < endDate) {
                var slotEndTime = new Date(current.getTime() + 30 * 60 * 1000);
                if(slotEndTime>endDate){
                    slotEndTime=endDate
                }
                slots.push({
                day: day,
                startTime: current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                endTime: slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                });
                current = slotEndTime;
            }
            }
    }
    return slots;
  }

  function isSlotAvailable(slot, bookedAppointments) {
    const day = slot.day;
    const startDate = new Date(`2023-01-01T${slot.startTime.length == 5? slot.startTime:"0"+slot.startTime}`);
    const endDate = new Date(`2023-01-01T${slot.endTime.length == 5? slot.endTime:"0"+slot.endTime}`);
  
    for (let i = 0; i < bookedAppointments.length; i++) {
      const bookedAppointment = bookedAppointments[i];
      const bookedStartDate = new Date(`2023-01-01T${bookedAppointment.startTime.length == 5? bookedAppointment.startTime:"0"+bookedAppointment.startTime}`);
      const bookedEndDate = new Date(`2023-01-01T${bookedAppointment.endTime.length == 5? bookedAppointment.endTime:"0"+bookedAppointment.endTime}`);
  
      // Check if the booked appointment is on the same day
      if (bookedAppointment.day === day) {
        // Check for time collisions
        if (
          (startDate >= bookedStartDate && startDate < bookedEndDate) || // New slot starts within booked slot
          (endDate > bookedStartDate && endDate <= bookedEndDate) ||   // New slot ends within booked slot
          (startDate <= bookedStartDate && endDate >= bookedEndDate)     // New slot completely overlaps booked slot
        ) {
          return false; // Time collision found
        }
      }
    }
  
    return true; // No time collisions found
  }

  module.exports = {getSlots, isSlotAvailable}