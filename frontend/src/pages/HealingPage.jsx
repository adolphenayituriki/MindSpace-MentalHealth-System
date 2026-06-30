import HealingResources from '../components/healing/HealingResources';

export default function HealingPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Healing Tools</h1>
        <p>Breathing exercises, sounds, sleep tools, and more</p>
      </div>
      <HealingResources />
    </div>
  );
}
