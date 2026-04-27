
import  { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  User, 
  Shield, 
  Building2,
  Users as UsersIcon,
  Loader2,
  AlertTriangle,
  UserX
} from "lucide-react";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";
import { toast } from "react-toastify";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []); // FIXED

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATH.ADMIN.GET_ALL_USERS, { withCredentials: true });
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleRemoveClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedUser) return;

    try {
      await axiosInstance.delete(
        API_PATH.ADMIN.DELETE_USER(selectedUser.user_id),
        { withCredentials: true }
      );

      toast.success(`${selectedUser.username} deleted successfully`);

      // FIXED (user_id instead of id)
      setUsers(users.filter((u) => u.user_id !== selectedUser.user_id));
    } catch (err) {
      console.log(err)
      toast.error("Failed to delete user");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return {
          color: "bg-purple-100 text-purple-700 border-purple-200",
          icon: Shield,
          label: "Admin"
        };
      case "court_owner":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: Building2,
          label: "Court Owner"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: User,
          label: "User"
        };
    }
  };

  const roleStats = useMemo(() => {
  return {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    owners: users.filter(u => u.role === "court_owner").length,
    regular: users.filter(u => u.role === "user").length,
  };
}, [users]);


  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
        <p className="text-gray-600 text-lg font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-400 p-3 rounded-xl shadow-md">
              <UsersIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.total}</p>

            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-xl shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.admins}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Court Owners</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.owners}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-xl shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Regular Users</p>
              <p className="text-2xl font-bold text-gray-900">{roleStats.regular}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-emerald-400" />
        <Input
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 rounded-xl border-2 border-emerald-100 focus:border-emerald-500 focus:ring-emerald-500 bg-white shadow-sm transition-all duration-300"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border-2 border-emerald-100 bg-white shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50">
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => {
              const roleBadge = getRoleBadge(user.role);
              const RoleIcon = roleBadge.icon;
              
              return (
                <TableRow
                  key={user.user_id}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-300 group"
                >
                  <TableCell className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      {user.username}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      {user.email}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${roleBadge.color}`}>
                      <RoleIcon className="w-3.5 h-3.5" />
                      {roleBadge.label}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      {user.phone || "N/A"}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 rounded-lg transition-all duration-300 group/btn"
                      onClick={() => handleRemoveClick(user)}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mb-4">
            <UserX className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg font-medium">No users found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search query</p>
        </div>
      )}

      {/* Remove User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-2 border-red-100 rounded-2xl shadow-2xl sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900 flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              Remove User
            </DialogTitle>
            <DialogDescription className="text-gray-600 pt-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                <p className="font-medium text-red-800 mb-2">
                  ⚠️ This action cannot be undone
                </p>
                <p className="text-sm text-red-700">
                  Are you sure you want to permanently remove{" "}
                  <strong className="font-bold">{selectedUser?.username}</strong>?
                </p>
              </div>
              
              {selectedUser && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{selectedUser.role}</span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}