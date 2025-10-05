import MachineCard from './MachineCard';

const MachineGrid = ({ machines, recentData }) => {
  if (!machines || machines.length === 0) {
    return (
      <div className="empty-state">
        <h3>No machines found</h3>
        <p>Add machines to start monitoring</p>
      </div>
    );
  }

  return (
    <div className="machine-grid">
      {machines.map((machine) => (
        <MachineCard 
          key={machine.id || machine._id} 
          machine={machine} 
          recentData={recentData}
        />
      ))}
    </div>
  );
};

export default MachineGrid;
