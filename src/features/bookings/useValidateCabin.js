import { useBookings } from "./useBookings";

export function useValidateCabin() {
  const { bookings } = useBookings();

  const isCabinAvailable = (selectedCabinId, startDate, endDate) => {
    if (!selectedCabinId || !startDate || !endDate) {
      return false; // Invalid input
    }

    const selectedStart = new Date(startDate);
    const selectedEnd = new Date(endDate);

    // Check if the selected cabin is available
    return bookings.every((booking) => {
      if (
        booking.cabinId === parseInt(selectedCabinId, 10) &&
        (booking.status === "unconfirmed" || booking.status === "checked-in")
      ) {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        // Check for overlapping dates
        return !(selectedStart < bookingEnd && selectedEnd > bookingStart);
      }
      return true;
    });
  };

  return { isCabinAvailable };
}
