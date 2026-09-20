import { MOCK_ACTIVITY, ACTIVITY_ICON } from "./mockActivity";

export default function RailActivitySection() {
  return (
    <div className="mp-rail-section">
      <div className="mp-rail-section-head">
        <h3 className="mp-rail-title">Marketplace Activity</h3>
      </div>
      <ul className="mp-activity-list">
        {MOCK_ACTIVITY.map((a) => (
          <li key={a.id} className="mp-activity-item">
            <span className={`mp-activity-icon mp-activity-icon--${a.type}`}>{ACTIVITY_ICON[a.type]}</span>
            <div className="mp-activity-body">
              <p className="mp-activity-title">{a.title}</p>
              <p className="mp-activity-detail">{a.detail}</p>
            </div>
            <span className="mp-activity-time">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
