import  { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "@/components/Admin/DashboardStats";
import AllCourts from "@/components/Admin/AllCourts";
import AdminApprovals from "@/components/Admin/Approval";
import AllUsers from "@/components/Admin/AllUsers";
import { Building2, CheckSquare, Users, BarChart3, Shield } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("courts");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 drop-shadow-md">Courtify Admin</h1>
              <p className="text-emerald-100 text-lg">Manage courts, approvals, and users</p>
            </div>
          </div>
        </div>

        {/* Dashboard Stats Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-400 p-3 rounded-xl shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          </div>
          <DashboardStats />
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

            {/* Tabs List */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-6">
              <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl p-2 shadow-md border border-emerald-100">

                <TabsTrigger
                  value="courts"
                  className="flex items-center gap-2 rounded-xl transition-all duration-300 
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 
                  data-[state=active]:via-teal-500 data-[state=active]:to-green-500 
                  data-[state=active]:text-white data-[state=active]:shadow-lg 
                  data-[state=active]:scale-105 text-gray-700 hover:bg-gradient-to-r 
                  hover:from-emerald-50 hover:to-teal-50 py-3"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="font-semibold">Courts</span>
                </TabsTrigger>

                <TabsTrigger
                  value="approvals"
                  className="flex items-center gap-2 rounded-xl transition-all duration-300 
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 
                  data-[state=active]:via-teal-500 data-[state=active]:to-green-500 
                  data-[state=active]:text-white data-[state=active]:shadow-lg 
                  data-[state=active]:scale-105 text-gray-700 hover:bg-gradient-to-r 
                  hover:from-emerald-50 hover:to-teal-50 py-3"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="font-semibold">Approvals</span>
                </TabsTrigger>

                <TabsTrigger
                  value="users"
                  className="flex items-center gap-2 rounded-xl transition-all duration-300 
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 
                  data-[state=active]:via-teal-500 data-[state=active]:to-green-500 
                  data-[state=active]:text-white data-[state=active]:shadow-lg 
                  data-[state=active]:scale-105 text-gray-700 hover:bg-gradient-to-r 
                  hover:from-emerald-50 hover:to-teal-50 py-3"
                >
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">Users</span>
                </TabsTrigger>

              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              <TabsContent value="courts">
                <AllCourts />
              </TabsContent>

              <TabsContent value="approvals">
                <AdminApprovals />
              </TabsContent>

              <TabsContent value="users">
                <AllUsers />
              </TabsContent>
            </div>

          </Tabs>
        </div>

      </div>

      {/* Soft Blurred Backgrounds */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    </div>
  );
}
