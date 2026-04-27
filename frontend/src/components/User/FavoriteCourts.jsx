import React, { useEffect, useState } from "react";
import CourtCard from "./CourtCard";
import axiosInstance from "@/utils/axios";
import { API_PATH } from "@/utils/apiPath";

export default function FavoriteCourts() {
  const [favorites, setFavorites] = useState([]); // favourite court objects
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        // 1️⃣ Get favourite IDs
        const favRes = await axiosInstance.get(API_PATH.FAVOURITES.GET_FAVOURITES, {
          withCredentials: true,
        });
        const favIds = favRes.data.favourites.map(f => f.court_id);

        // 2️⃣ Get all courts
        const courtsRes = await axiosInstance.get("/courts/all", { withCredentials: true });
        const allCourts = courtsRes.data.courts || [];

        // 3️⃣ Filter only favourite courts
        const favCourts = allCourts.filter(court => favIds.includes(court.id));

        setFavorites(favCourts);
      } catch (error) {
        console.error("Failed to load favourite courts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleRemove = async (courtId) => {
    try {
      await axiosInstance.delete(API_PATH.FAVOURITES.REMOVE_FAVOURITE(courtId), {
        withCredentials: true,
      });

      setFavorites(prev => prev.filter(court => court.id !== courtId));
    } catch (error) {
      console.error("Failed to remove favourite:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-600">Loading favourite courts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-slate-900">Your Favorite Courts</h2>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(court => (
            <div key={court.id} className="relative">
              <CourtCard
                court={court}
                isFav={true}
                onRemoveFavourite={() => handleRemove(court.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-slate-500 text-lg">
            No favourite courts yet. Add some to get started!
          </p>
        </div>
      )}
    </div>
  );
}
