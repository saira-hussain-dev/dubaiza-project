
export default function ListingModal({ item, onClose, onFav, isFav, onContact }) {
  if (!item) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img className="detail-img" src={item.image} alt={item.title} />
        <div className="detail-meta">{item.category.toUpperCase()} • {item.time} • 📍 {item.location}</div>
        <h2>{item.title}</h2>
        <p className="price large">{item.price}</p>
        <p>{item.desc || item.spec}</p>
        <p className="detail-spec">{item.spec}</p>
        <div className="detail-actions">
          <button className="btn-red" onClick={() => onContact('Call', item)}>📞 Call Seller</button>
          <button className="btn-outline" onClick={() => onContact('Chat', item)}>💬 Chat</button>
          <button className="btn-outline" onClick={() => onFav(item.id)}>{isFav ? '♥ Saved' : '♡ Save'}</button>
        </div>
      </div>
    </div>
  )
}
