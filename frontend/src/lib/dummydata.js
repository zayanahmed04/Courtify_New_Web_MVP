// dummyCourts.js

// Generate full 1-hour time slots, ignore last incomplete slot
export function generateTimeSlots(openTime, closeTime) {
    const slots = [];

    let [openHour, openMinute] = openTime.split(":").map(Number);
    let [closeHour, closeMinute] = closeTime.split(":").map(Number);

    let current = new Date();
    current.setHours(openHour, openMinute, 0, 0);

    const end = new Date();
    end.setHours(closeHour, closeMinute, 0, 0);

    while (true) {
        let next = new Date(current);
        next.setHours(current.getHours() + 1);

        // Agar next slot closing time se zyada hai, break karo
        if (next > end) break;

        const startTime = `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2,"0")}`;
        const endTime = `${String(next.getHours()).padStart(2,"0")}:${String(next.getMinutes()).padStart(2,"0")}`;

        slots.push({ id: `${startTime}-${endTime}`, startTime, endTime });

        current = next;
    }

    return slots;
}

// Get next 7 days starting from today
export function getNext7Days() {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push(date.toISOString().split("T")[0]);
    }
    return days;
}

// Format date to readable label
export function getDateLabel(dateStr, index) {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";

    const date = new Date(dateStr);
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
}

// Create booking state object
export function createBookingState(courtId, date, startTime) {
    return {
        courtId,
        date,
        startTime,
    };
}