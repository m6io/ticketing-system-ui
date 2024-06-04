import { useEffect } from "react";
import useAuthStore from "@/store";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login, Register } from "@/routes/Auth";
import { Tickets } from "@/routes/Tickets";
import { Layout } from "@/components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ViewTicket } from "@/routes/Ticket";
import { EditTicket } from "@/routes/TicketEdit";
import { CreateTicket } from "@/routes/TicketNew";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import useOnNavigate from "@/hooks/useOnNavigate";

const App: React.FC = () => {
  const { isAuthenticated, verifyToken, error, success, resetNotification } =
    useAuthStore();
  const { toast } = useToast();

  useOnNavigate();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
      resetNotification();
    }
    if (success) {
      toast({ title: "Success", description: success });
      resetNotification();
    }
  }, [error, success, toast, resetNotification]);

  return (
    <TooltipProvider>
      <Layout>
        <div className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/tickets" /> : <Login />}
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/tickets" /> : <Register />
              }
            />
            <Route
              path="/tickets"
              element={isAuthenticated ? <Tickets /> : <Navigate to="/" />}
            />
            <Route
              path="/tickets/:id"
              element={isAuthenticated ? <ViewTicket /> : <Navigate to="/" />}
            />
            <Route
              path="/tickets/:id/edit"
              element={isAuthenticated ? <EditTicket /> : <Navigate to="/" />}
            />
            <Route
              path="/tickets/new"
              element={isAuthenticated ? <CreateTicket /> : <Navigate to="/" />}
            />
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <div>404 - Page Not Found</div>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </Layout>
      <Toaster />
    </TooltipProvider>
  );
};

export default App;
