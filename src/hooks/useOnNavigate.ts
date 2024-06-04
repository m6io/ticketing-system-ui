import useAuthStore from "@/store";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useOnNavigate = () => {
  const location = useLocation();
  const clearCurrentTicket = useAuthStore((state) => state.clearCurrentTicket);

  useEffect(() => {
    // Clear current ticket content on route change
    clearCurrentTicket();
  }, [location, clearCurrentTicket]);
};

export default useOnNavigate;
