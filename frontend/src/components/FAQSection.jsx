

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function FAQSection() {
  return (
    <section className="w-full bg-white px-4 py-16">
      
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center mb-4 text-green-600">
        Frequently Asked Questions
      </h2>

      <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
        Quick answers to common questions about bookings, cancellations, and policies.
      </p>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto px-2">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full border rounded-xl bg-white shadow-sm px-4"
        >
          <AccordionItem value="q1" className="border-b">
            <AccordionTrigger className="text-gray-900 hover:text-green-600">
              How do I book a court?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Browse available courts, pick your date and time, and confirm your booking.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2" className="border-b">
            <AccordionTrigger className="text-gray-900 hover:text-green-600">
              Can I cancel or reschedule?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Yes — free changes up to 12 hours before your slot. Inside 12 hours, small fees may apply.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3" className="border-b">
            <AccordionTrigger className="text-gray-900 hover:text-green-600">
              Do you offer memberships?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              We offer flexible passes and monthly memberships with discounts and priority bookings.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger className="text-gray-900 hover:text-green-600">
              What equipment is provided?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Goals and markings are provided; balls and bibs can be rented at the front desk.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
