import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import useAuthStore, { TicketStatus } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VscIssueReopened } from "react-icons/vsc";
import { VscPass } from "react-icons/vsc";
import { VscChevronRight } from "react-icons/vsc";
import { VscEdit } from "react-icons/vsc";
import { VscTrash } from "react-icons/vsc";
import { VscAdd } from "react-icons/vsc";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Tickets: React.FC = () => {
  const {
    tickets,
    fetchTickets,
    error,
    closeTicket,
    openTicket,
    deleteTicket,
  } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const openTickets = tickets
    ? tickets
        .filter((ticket) => ticket.status === TicketStatus.OPEN)
        .sort(
          (a, b) =>
            new Date(b.create_date).getTime() -
            new Date(a.create_date).getTime()
        )
    : [];

  const closedTickets = tickets
    ? tickets
        .filter(
          (ticket) =>
            ticket.status === TicketStatus.CLOSED && ticket.closed_date
        )
        .sort((a, b) => {
          const dateA = new Date(a.closed_date || "");
          const dateB = new Date(b.closed_date || "");
          return dateB.getTime() - dateA.getTime();
        })
    : [];

  return (
    <div className="space-y-8 p-4">
      <div className="flex gap-2 max-sm:flex-col sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Tickets</h2>
        <div className="h-full">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              {
                navigate("/tickets/new");
              }
            }}
          >
            <VscAdd className="size-4" />
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <h3 className="my-2 flex items-end gap-2 text-xl font-semibold">
        Open Tickets
      </h3>

      <Table>
        <TableHeader className="sticky top-0 z-40">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Created Date</TableHead>
            <TableHead className="flex justify-end items-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {openTickets.map((ticket) => (
            <TableRow key={`${ticket.ticket_id}`}>
              <TableCell>{ticket.ticket_id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {new Date(ticket.create_date).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <ActionButton
                    icon={<VscPass className="size-4" />}
                    onClick={() => closeTicket(`${ticket.ticket_id}`)}
                    tooltip="Close ticket"
                  />
                  <ActionButton
                    icon={<VscEdit className="size-4" />}
                    onClick={() =>
                      navigate(`/tickets/${`${ticket.ticket_id}`}/edit`)
                    }
                    tooltip="Edit ticket"
                  />
                  <ActionButton
                    icon={<VscChevronRight className="size-4" />}
                    onClick={() =>
                      navigate(`/tickets/${`${ticket.ticket_id}`}`)
                    }
                    tooltip="View ticket details"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="my-2 flex items-end gap-2 text-xl font-semibold">
        Closed Tickets
      </h3>
      <Table>
        <TableHeader className="sticky top-0 z-40">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Created Date</TableHead>
            <TableHead>Closed Date</TableHead>
            <TableHead className="flex justify-end items-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {closedTickets.map((ticket) => (
            <TableRow key={`${ticket.ticket_id}`}>
              <TableCell>{ticket.ticket_id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {new Date(ticket.create_date).toLocaleString()}
              </TableCell>
              <TableCell>
                {ticket.closed_date
                  ? new Date(ticket.closed_date).toLocaleString()
                  : "Error in closed date"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <ActionButton
                    icon={<VscTrash className="size-4" />}
                    onClick={() => deleteTicket(`${ticket.ticket_id}`)}
                    tooltip="Delete ticket"
                    variant="destructive"
                  />
                  <ActionButton
                    icon={<VscIssueReopened className="size-4" />}
                    onClick={() => openTicket(`${ticket.ticket_id}`)}
                    tooltip="Re-open ticket"
                  />
                  <ActionButton
                    icon={<VscEdit className="size-4" />}
                    onClick={() =>
                      navigate(`/tickets/${`${ticket.ticket_id}`}/edit`)
                    }
                    tooltip="Edit ticket"
                  />
                  <ActionButton
                    icon={<VscChevronRight className="size-4" />}
                    onClick={() =>
                      navigate(`/tickets/${`${ticket.ticket_id}`}`)
                    }
                    tooltip="View ticket details"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  variant?: "outline" | "destructive";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  tooltip,
  variant = "outline",
}) => {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button variant={variant} size="icon" onClick={onClick}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};
