"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MatchForm({ onSubmit, onCancel, sports }) {
  const [formData, setFormData] = useState({
    sport: sports[0] || "",
    location: "",
    dateTime: "",
    message: "",
    whatsappNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.sport &&
      formData.location &&
      formData.dateTime &&
      formData.message &&
      formData.whatsappNumber
    ) {
      onSubmit(formData);
      setFormData({
        sport: sports[0] || "",
        location: "",
        dateTime: "",
        message: "",
        whatsappNumber: "",
      });
    }
  };

  return (
    <Card className="bg-card border border-border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Post Your Match</h2>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sport */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Sport</label>
            <Select
              value={formData.sport}
              onValueChange={(value) => setFormData({ ...formData, sport: value })}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Location</label>
            <Input
              type="text"
              placeholder="e.g., Central Park, NYC"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Date & Time</label>
            <Input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="bg-input border-border text-foreground"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">WhatsApp Number</label>
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Match Details</label>
          <Textarea
            placeholder="Describe your match, required skill level, number of players needed, etc."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-24"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Post Match
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
