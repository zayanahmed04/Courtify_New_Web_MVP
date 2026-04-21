import React from "react";

export function PageHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-12 space-y-3 animate-in fade-in-50 slide-in-from-top duration-500">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">{title}</h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">{subtitle}</p>
    </div>
  );
}
