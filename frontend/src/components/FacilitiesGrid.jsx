import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, CheckCircle, Calendar, Edit2, CreditCard } from "lucide-react"

const FacilitiesGrid = () => {
  const items = [
    {
      title: "Add Court",
      desc: "Admins can add new futsal courts with images and details.",
      icon: <PlusCircle className="w-12 h-12 text-green-600 mx-auto" />
    },
    {
      title: "Approval",
      desc: "Pending courts can be reviewed and approved by the admin.",
      icon: <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
    },
    {
      title: "Book Slot",
      desc: "Players can book available slots easily in real-time.",
      icon: <Calendar className="w-12 h-12 text-green-600 mx-auto" />
    },
    ,
    {
      title: "Payment Gateway",
      desc: "Secure online payments for hassle-free bookings.",
      icon: <CreditCard className="w-12 h-12 text-green-600 mx-auto" />
    },
  ]

  return (
    <section className="mx-auto w-full max-w-6xl mt-10">
      {/* Title */}
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-green-600">
          Features & Amenities
        </h2>
        <p className="mt-2 text-gray-600">
          Everything you need for a great futsal experience—before, during, and after the match.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Card 
            key={it.title} 
            className="h-full bg-white border border-green-200 shadow-sm hover:shadow-md transition-all"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-600">
                {it.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {it.desc}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center py-4">
              {it.icon}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default FacilitiesGrid
