import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Trash2,
  MapPin,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Loader2,
  AlertTriangle
} from "lucide-react";

import { toast } from "react-toastify";

export default function AllCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);

  // Fetch all courts
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await axiosInstance.get(API_PATH.COURT.ALL_COURTS);
        console.log(res.data.courts)
        setCourts(res.data.courts || []);
      } catch (err) {
        console.error("Error fetching courts:", err);
        toast.error("Failed to load courts");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  // Open delete dialog
  const handleDeleteClick = (court) => {
    setSelectedCourt(court);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedCourt) return;

    try {
      await axiosInstance.delete(API_PATH.COURT.DELETE_COURT(selectedCourt.id));

      // remove from UI
      setCourts((prev) => prev.filter((c) => c.id !== selectedCourt.id));

      toast.success("Court deleted successfully!");

    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete court");
    }

    setDeleteDialogOpen(false);
    setSelectedCourt(null);
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();

    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approved
        </span>
      );
    }

    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
        <p className="text-gray-600 text-lg font-medium">Loading courts...</p>
      </div>
    );
  }

  // Empty state
  if (courts.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-12 h-12 text-emerald-600" />
        </div>
        <p className="text-gray-600 text-lg font-medium">No courts found</p>
        <p className="text-gray-400 text-sm mt-2">Courts will appear here once added</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">

      {/* Stats Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-400 p-3 rounded-xl shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Courts</p>
              <p className="text-2xl font-bold text-gray-900">{courts.length}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs text-emerald-600 font-medium">Approved</p>
              <p className="text-lg font-bold text-emerald-700">
                {courts.filter(c => c.status.toLowerCase() === "approved").length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-600 font-medium">Pending</p>
              <p className="text-lg font-bold text-amber-700">
                {courts.filter(c => c.status.toLowerCase() === "pending").length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-red-600 font-medium">Rejected</p>
              <p className="text-lg font-bold text-red-700">
                {courts.filter(c => c.status.toLowerCase() === "rejected").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courts Table */}
      <div className="rounded-2xl border-2 border-emerald-100 bg-white shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Court Name
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Price/Hour
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Type
                </div>
              </TableHead>
              <TableHead className="text-emerald-900 font-bold">Status</TableHead>
              <TableHead className="text-emerald-900 font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courts.map((court) => (
              <TableRow
                key={court.id}
                className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all"
              >
                <TableCell className="font-semibold text-gray-900">{court.name}</TableCell>

                <TableCell className="text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {court.location}
                  </div>
                </TableCell>

                <TableCell className="text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-gray-900">{court.hourly_rate}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
                    <Tag className="w-3 h-3" />
                    {court.type}
                  </span>
                </TableCell>

                <TableCell>{getStatusBadge(court.status)}</TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border hover:border-red-200 rounded-lg"
                    onClick={() => handleDeleteClick(court)}
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-2 border-red-100 rounded-2xl shadow-2xl sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900 flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              Delete Court
            </DialogTitle>

            <DialogDescription className="text-gray-600 pt-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                <p className="font-medium text-red-800 mb-2">⚠️ This action cannot be undone</p>
                <p className="text-sm text-red-700">
                  Are you sure you want to permanently delete{" "}
                  <strong>{selectedCourt?.name}</strong>?
                </p>
              </div>

              {selectedCourt && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedCourt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{selectedCourt.type}</span>
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
              onClick={handleConfirmDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}