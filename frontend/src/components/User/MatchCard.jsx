import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function MatchCard({ match }) {
  // Safe fallback values
  const whatsappNumber = match.whatsappNumber || match.contact_number || "";
  const message = match.message || match.match_details || "";
  const icon = match.icon || "🎯";
  const sport = match.sport || "Sport";
  const location = match.location || "Location";
  const dateTime = match.dateTime || match.date_time || "";

  // Use safe whatsappNumber variable
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hi! I'm interested in joining your ${sport} match at ${location}. ${message}`
  )}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border border-border rounded-lg">
      {/* Sport Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
        <div className="text-5xl mb-3">{icon}</div>
        <h3 className="text-2xl font-bold">{sport}</h3>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Location */}
        <div className="flex items-start gap-3">
          <span className="text-xl mt-1">📍</span>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-semibold text-foreground">{location}</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-start gap-3">
          <span className="text-xl mt-1">🕐</span>
          <div>
            <p className="text-sm text-muted-foreground">Date & Time</p>
            <p className="font-semibold text-foreground">{dateTime}</p>
          </div>
        </div>

        {/* Message */}
        <div className="flex items-start gap-3">
          <span className="text-xl mt-1">💬</span>
          <div>
            <p className="text-sm text-muted-foreground">Details</p>
            <p className="font-semibold text-foreground">{message}</p>
          </div>
        </div>

        {/* WhatsApp Button */}
        <Button asChild className="w-full bg-[#25D366] hover:bg-[#20BA5B] text-white font-semibold gap-2 mt-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5" />
            Contact on WhatsApp
          </a>
        </Button>
      </div>
    </Card>
  );
}