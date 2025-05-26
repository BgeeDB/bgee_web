import isPlural from '../../helpers/isPlural';

const GenesDetailsModal = ({ data }) => {
  if (!data || Object.keys(data.detectedSpecies).length === 0) return null;
  return (
    <div className="content">
      <p>
        {`Selected species: `}
        <i>{`${data.detectedSpecies[data.selectedSpecies].genus} ${
          data.detectedSpecies[data.selectedSpecies].speciesName
        }`}</i>
        {`, ${
          data.geneCount[data.selectedSpecies]
        } unique genes identified in Bgee`}
      </p>
      {Object.keys(data.detectedSpecies).length > 1 && (
        <>
          <p>Other species detected in ID list: </p>
          <ul className="unordered">
            {Object.entries(data.detectedSpecies).map(([key, value]) =>
              key === data.selectedSpecies.toString() ? null : (
                <li key={key}>
                  <p>
                    <i>{`${value.genus} ${value.speciesName}`}</i>
                    {`: ${data.geneCount[key]} ${isPlural(
                      'gene',
                      data.geneCount[key]
                    )} identified`}
                  </p>
                </li>
              )
            )}
          </ul>
        </>
      )}
      {data.undeterminedGeneIds.length > 0 && (
        <p>IDs not identified: {data.undeterminedGeneIds.length}</p>
      )}
      {data.notInSelectedSpeciesGeneIds.length > 0 && (
        <>
          <p>ID in other species: </p>

          <ul className="unordered">
            {data.notInSelectedSpeciesGeneIds.slice(0, 10).map((v) => (
              <TextGene key={v} gene={v} />
            ))}
            {data.notInSelectedSpeciesGeneIds.length > 10 && (
              <li>
                <p>...</p>
              </li>
            )}
          </ul>
        </>
      )}

      {data.undeterminedGeneIds.length > 0 && (
        <>
          <p>IDs not identified:</p>
          <ul className="unordered">
            {data.undeterminedGeneIds.slice(0, 10).map((v) => (
              <TextGene key={v} gene={v} />
            ))}
            {data.undeterminedGeneIds.length > 10 && (
              <li>
                <p>...</p>
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

const TextGene = ({ gene }) => (
  <li>
    <p>{gene}</p>
  </li>
);
export default GenesDetailsModal;
