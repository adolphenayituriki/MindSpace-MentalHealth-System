import { useState } from 'react';
import CommunityList from '../components/communities/CommunityList';
import CommunityRoom from '../components/communities/CommunityRoom';

export default function CommunityPage() {
  const [active, setActive] = useState(null);

  if (active) {
    return (
      <CommunityRoom
        community={active}
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Communities</h1>
      </div>
      <CommunityList onSelect={setActive} />
    </div>
  );
}
