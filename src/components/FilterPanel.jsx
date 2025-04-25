import SpecialtiesFilter from './SpecialtiesFilter';

const FilterPanel = ({
  consultationType,
  onConsultationTypeChange,
  specialties,
  selectedSpecialties,
  onSpecialtyToggle,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h4 className="filter-header" data-testid="filter-header-moc">Consultation Mode</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="consultationType"
              value="video"
              checked={consultationType === 'video'}
              onChange={() => onConsultationTypeChange('video')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="consultationType"
              value="clinic"
              checked={consultationType === 'clinic'}
              onChange={() => onConsultationTypeChange('clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      <SpecialtiesFilter
        specialties={specialties}
        selectedSpecialties={selectedSpecialties}
        onSpecialtyToggle={onSpecialtyToggle}
      />

      <div className="filter-section">
        <h4 className="filter-header" data-testid="filter-header-sort">Sort</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="sortBy"
              value="fees"
              checked={sortBy === 'fees'}
              onChange={() => onSortChange('fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="sortBy"
              value="experience"
              checked={sortBy === 'experience'}
              onChange={() => onSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;