// Sample notifications only. Real notifications need a backend that creates
// a notification when something happens (new message, price drop, ad view).

export default function NotificationsPanel({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onClear
}) {
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal wide"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Notifications</h2>

        <p className="modal-sub">
          {unread === 0
            ? 'You are all caught up.'
            : `${unread} unread notification${unread !== 1 ? 's' : ''}`}
        </p>

        <div className="panel-actions">
          <button
            className="btn-outline"
            onClick={onMarkAllRead}
          >
            Mark all as read
          </button>

          <button
            className="btn-outline"
            onClick={onClear}
          >
            Clear all
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>

            <h3>No notifications</h3>

            <p>
              When someone messages you or a saved listing changes,
              it will appear here.
            </p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((n) => (
              <button
                key={n.id}
                className={n.read ? 'notif-item read' : 'notif-item'}
                onClick={() => onMarkRead(n.id)}
              >
                <strong>{n.title}</strong>

                <span>{n.text}</span>

                <span className="notif-time">
                  {n.time} {!n.read && '• Unread — click to mark read'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}