export type SpeciesLike = {
  name?: string;
  genus?: string;
  speciesName?: string;
};

export const getSpeciesLabel = (species?: SpeciesLike | null): string | undefined => {
  if (!species) {
    return undefined;
  }

  const scientific = `${species.genus || ''} ${species.speciesName || ''}`.trim();
  const commonName = species.name?.trim();

  if (scientific && commonName) {
    return `${scientific} - ${commonName}`;
  }
  if (scientific) {
    return scientific;
  }
  return commonName || undefined;
};
