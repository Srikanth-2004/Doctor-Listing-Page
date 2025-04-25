const SpecialtiesFilter = ({ specialties, selectedSpecialties, onSpecialtyToggle }) => {
  return (
    <div className="filter-section">
      <h4 className="filter-header" data-testid="filter-header-speciality">Speciality</h4>
      <div className="filter-options">
        {specialties.map((specialty) => (
          <label key={specialty} className="filter-option">
            <input
              type="checkbox"
              checked={selectedSpecialties.includes(specialty)}
              onChange={() => onSpecialtyToggle(specialty)}
              data-testid={`filter-specialty-${specialty.replace(/\s+/g, '-').replace('/', '-')}`}
            />
            {specialty}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SpecialtiesFilter;