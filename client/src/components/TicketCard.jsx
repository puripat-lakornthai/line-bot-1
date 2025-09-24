import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import '../styles/TicketCard.css';

const TicketCard = ({ ticket }) => {
  if (!ticket) return null;

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <h3 className="ticket-card-title">
          <Link to={`/tickets/${ticket.ticket_id}`} className="ticket-card-link">
            {ticket.title}
          </Link>
        </h3>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="ticket-card-body">
        <p><strong>ID:</strong> #{ticket.ticket_id}</p>
        <p><strong>ผู้แจ้ง:</strong> {ticket.requester_fullname || 'N/A'}</p>
        <p>
          <strong>ผู้รับผิดชอบ:</strong>{' '}
          {ticket.assignee_fullname || (
            <span className="ticket-unassigned">ยังไม่มอบหมาย</span>
          )}
        </p>
        <p><strong>อัปเดตล่าสุด:</strong>{' '}
          {new Date(ticket.updated_at).toLocaleString('th-TH', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
        {ticket.attachments?.length > 0 && (
          <div className="ticket-card-attachments">
            <small>📎 มี {ticket.attachments.length} ไฟล์แนบ</small>
          </div>
        )}
      </div>

      <div className="ticket-card-footer">
        <Link to={`/tickets/${ticket.ticket_id}`} className="btn btn-secondary">
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
};

export default TicketCard;
