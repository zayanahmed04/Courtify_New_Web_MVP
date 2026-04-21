import React, { useState, useEffect } from "react";
import CourtCard from "./CourtCard.jsx";
import axiosInstance from "@/utils/axios.js";
import { toast } from "react-toastify";
import { API_PATH } from "@/utils/apiPath.js";

export default function SearchCourts() {
  const [courts, setCourts] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");

  const sports = ["all", "Football", "Badminton", "Tennis", "Basketball", "Volleyball", "Cricket"];

  //----------------------------------
  // Fetch COURTS
  //----------------------------------
  const fetchCourts = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_PATH.COURT.ALL_COURTS, { withCredentials: true });
      console.log(res);

      const fetchedCourts = res.data.courts || [];

      // Fetch my ratings
      const ratingsRes = await axiosInstance.get(API_PATH.REVIEWS.MY_REVIEWS, {
        withCredentials: true,
      });
      const myRatings = ratingsRes.data.reviews || [];

      // Merge ratings with courts
      const courtsWithRatings = fetchedCourts.map((court) => {
        const myRating = myRatings.find((r) => r.court_id === court.id);
        return {
          ...court,
          rating: myRating?.rating || 0,
        };
      });

      setCourts(courtsWithRatings);
    } catch (err) {
      toast.error("Failed to fetch courts");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------
  // Fetch FAVOURITES
  //----------------------------------
  const fetchFavourites = async () => {
    try {
      setFavLoading(true);
      const res = await axiosInstance.get(API_PATH.FAVOURITES.GET_FAVOURITES, {
        withCredentials: true,
      });
      setFavourites(res.data.favourites || []);
    } catch (err) {
      console.log("Fav fetch error:", err);
    } finally {
      setFavLoading(false);
    }
  };

  //----------------------------------
  // ADD Favourite
  //----------------------------------
  const addFavourite = async (court_id) => {
    try {
      await axiosInstance.post(
        API_PATH.FAVOURITES.ADD_FAVOURITE,
        { court_id },
        { withCredentials: true }
      );

      fetchFavourites();
      toast.success("Added to favourites");
    } catch (err) {
      toast.error("Failed to add favourite");
    }
  };

  //----------------------------------
  // REMOVE Favourite
  //----------------------------------
  const removeFavourite = async (court_id) => {
    try {
      const fav = favourites.find((f) => f.court_id === court_id);
      if (!fav) return;

      await axiosInstance.delete(API_PATH.FAVOURITES.REMOVE_FAVOURITE(court_id), {
        withCredentials: true,
      });

      fetchFavourites();
    } catch (err) {
      toast.error("Failed to remove favourite");
    }
  };

  //----------------------------------
  // Load on Mount
  //----------------------------------
  useEffect(() => {
    fetchCourts();
    fetchFavourites();
  }, []);

  //----------------------------------
  // Filter Courts
  //----------------------------------
  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSport =
      selectedSport === "all" ||
      court.type?.toLowerCase() === selectedSport.toLowerCase();

    return matchesSearch && matchesSport;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search courts by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white border border-slate-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-3.5 text-slate-400">🔍</span>
        </div>

        <button className="px-6 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 transition-colors">
          🎛️ Filter
        </button>
      </div>

      {/* Sports Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedSport === sport
                ? "bg-green-500 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300 hover:border-green-500"
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Courts Grid */}
      {loading || favLoading ? (
        <div className="text-center py-12 text-slate-500">Loading courts...</div>
      ) : filteredCourts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => {
            const isFav = favourites.some((f) => f.court_id === court.id);

            return (
              <CourtCard
                key={court.id}
                court={court}
                isFav={isFav}
                onAddFavourite={() => addFavourite(court.id)}
                onRemoveFavourite={() => removeFavourite(court.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No courts found matching your search.</p>
        </div>
      )}
    </div>
  );
}
