// --- SlotGrid.jsx (Glassmorphism + Animated Version) ---
import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";


export function SlotGrid({ slots, onSlotSelect, selectedSlot, bookedSlots = [], selectedDate }) {
return (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
{slots.map((slot, idx) => {
const slotWithDate = { ...slot, date: selectedDate };
const isBooked = bookedSlots.some(
b => b.date === slotWithDate.date && b.startTime === slotWithDate.startTime
);
const isSelected = selectedSlot?.startTime === slot.startTime;


return (
<motion.button
key={idx}
whileHover={!isBooked ? { scale: 1.05 } : {}}
whileTap={!isBooked ? { scale: 0.95 } : {}}
onClick={() => !isBooked && onSlotSelect(slotWithDate)}
disabled={isBooked}
className={`p-4 rounded-xl font-semibold transition-all backdrop-blur-sm border
${isBooked
? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
: isSelected
? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl border-green-500'
: 'bg-white/60 hover:bg-white/80 text-green-700 border-green-200 shadow-md'}
`}
>
<Clock className="w-4 h-4 mx-auto mb-1" />
<div className="text-sm font-bold">{slot.startTime}</div>
<div className="text-xs opacity-60">to</div>
<div className="text-sm font-bold">{slot.endTime}</div>
{isBooked && <div className="text-xs mt-1 font-medium">Booked</div>}
</motion.button>
);
})}
</div>
);
}