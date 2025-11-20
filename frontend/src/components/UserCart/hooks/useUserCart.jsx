import { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../services ";

export const useUserCart = (restaurantID, tableNumber) => {
  const { user, isLoggedIn } = useUser();

  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const res = await api.get(`/restaurant/${restaurantID}`);
        if (res.data.success) {
          setRestaurantInfo(res.data.restaurant);
          console.log(res.data.restaurant.GST);
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      }
    };

    fetchRestaurantInfo();
  }, [restaurantID]);

  const handleProceedToCheckout = () => {
    if (isLoggedIn && user) {
      // Direct checkout for logged-in users
      setShowUserForm(false);
    } else {
      setShowUserForm(true);
    }
  };

  const handleCloseModal = () => {
    setShowUserForm(false);
  };

  return {
    restaurantInfo,
    showUserForm,
    specialInstructions,
    setSpecialInstructions,
    handleProceedToCheckout,
    handleCloseModal,
    isSubmitting,
    setIsSubmitting,
    user,
    isLoggedIn,
  };
};
