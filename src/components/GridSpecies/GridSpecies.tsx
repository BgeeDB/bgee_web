import React from 'react';
import { Link } from 'react-router';
import classnames from '../../helpers/classnames';
import { CardSpecies } from '../CustomCard';
import useQuery from '../../hooks/useQuery';

const Wrapper = ({ species, selectedSpecies, setSelectedSpecies, onClick, onRenderSelection, to, children }) => {
  if (to) {
    return <Link to={to(species)}>{children}</Link>;
  }

  return (
    <div
      id={`species-${species.id}`}
      onClick={e => {
        e.nativeEvent.preventDefault();
        if (onClick) onClick(species, selectedSpecies !== species.id);
        if (onRenderSelection && setSelectedSpecies)
          setSelectedSpecies(prev => (prev === species.id ? undefined : species.id));
      }}
      className={classnames('center-in-grid is-flex is-justify-content-center', {
        active: selectedSpecies === species.id,
      })}
    >
      {children}
    </div>
  );
};

const GridSpecies = ({
  speciesList,
  onRenderSelection,
  onClick,
  to,
  expandable,
  defaultSelection,
  scrollAt = true,
}: any) => {
  const speciesID = useQuery('id');

  const [selectedSpecies, setSelectedSpecies] = React.useState(
    defaultSelection ? parseInt(defaultSelection, 10) : undefined
  );

  React.useEffect(() => {
    if (speciesID && scrollAt) {
      setSelectedSpecies(parseInt(speciesID.toString(), 10));
      setTimeout(() => {
        document.getElementById(`species-${speciesID}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }, [speciesID, scrollAt]);

  return (
    <div className="species-grid">
      {speciesList.map(species => (
        <React.Fragment key={species.id}>
          <Wrapper
            to={to}
            species={species}
            selectedSpecies={selectedSpecies}
            setSelectedSpecies={setSelectedSpecies}
            onClick={onClick}
            onRenderSelection={onRenderSelection}
          >
            <CardSpecies {...species} />
          </Wrapper>

          {!expandable &&
            onRenderSelection &&
            selectedSpecies === species.id &&
            onRenderSelection(species, {
              onClose: () => {
                if (onClick) onClick(species, false);
                setSelectedSpecies(undefined);
              },
            })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GridSpecies;
