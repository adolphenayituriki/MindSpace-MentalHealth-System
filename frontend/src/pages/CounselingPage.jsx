import CounselorList from '../components/counseling/CounselorList';
import CounselingChat from '../components/counseling/CounselingChat';

export default function CounselingPage() {
  return (
    <div className="counseling-page">
      <div className="counseling-form-col">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Counseling</h1>
        </div>
        <CounselingChat />
      </div>
      <div className="counseling-counselors-col">
        <CounselorList />
      </div>
    </div>
  );
}
