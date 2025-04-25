const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-info">
        <h3 className="doctor-name" data-testid="doctor-name">{doctor.name}</h3>
        <div className="doctor-specialty" data-testid="doctor-specialty">
          {doctor.specialties.join(', ')}
        </div>
        <div className="doctor-experience" data-testid="doctor-experience">
          {doctor.experience} years experience
        </div>
      </div>
      <div className="doctor-fee" data-testid="doctor-fee">
        ₹{doctor.fee}
      </div>
    </div>
  );
};

export default DoctorCard;