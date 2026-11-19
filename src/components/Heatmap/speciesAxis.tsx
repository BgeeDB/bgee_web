import {
  SPECIES_TAXON_SELECTED,
  TAXON_LABEL_FONT_SIZE,
  highlightedTaxonKeys,
  type SpeciesAxisLayout,
} from './speciesAxisLayout';

export {
  buildSpeciesAxisLayout,
  SPECIES_COLUMN_HIGHLIGHT,
  SPECIES_TAXON_SELECTED,
  type SpeciesAxisBracketMark,
  type SpeciesAxisLayout,
  type SpeciesAxisLeafMark,
} from './speciesAxisLayout';

const toggleTaxon = (
  event: { key: string; preventDefault: () => void },
  key: string,
  onToggle: (key: string) => void
) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  onToggle(key);
};

const speciesBracketPath = (x1: number, x2: number, y: number, tick: number) =>
  `M ${x1} ${y + tick} V ${y} H ${x2} V ${y + tick}`;

export const SpeciesAxisMarks = ({
  layout,
  selectedKey,
  onToggle,
}: {
  layout: SpeciesAxisLayout;
  selectedKey: string | null;
  onToggle: (key: string) => void;
}) => {
  const highlighted = highlightedTaxonKeys(layout, selectedKey);
  return (
    <g data-testid="species-axis-tree">
      {layout.brackets.map((bracket) => {
        const x1 = bracket.xs[0];
        const x2 = bracket.xs[bracket.xs.length - 1];
        const pressed = bracket.key === selectedKey;
        const selected = highlighted.has(bracket.key);
        const stroke = selected ? SPECIES_TAXON_SELECTED : '#444';
        return (
          <g
            key={bracket.key}
            data-testid={`species-taxon-${bracket.key}`}
            role="button"
            tabIndex={0}
            aria-pressed={pressed}
            aria-label={bracket.label}
            style={{ cursor: 'pointer' }}
            onClick={() => onToggle(bracket.key)}
            onKeyDown={(event) => toggleTaxon(event, bracket.key, onToggle)}
          >
            <line x1={x1} y1={bracket.y} x2={x2} y2={bracket.y} stroke="transparent" strokeWidth={12}>
              <title>{bracket.label}</title>
            </line>
            <line x1={x1} y1={bracket.y} x2={x2} y2={bracket.y} stroke={stroke} strokeWidth={selected ? 2 : 1} />
            {bracket.xs.map((x, index) => {
              const leafKey = bracket.childLeafKeys[index];
              const stemSelected = selected || (leafKey != null && leafKey === selectedKey);
              const stemStroke = stemSelected ? SPECIES_TAXON_SELECTED : '#444';
              return (
                <line
                  key={`${bracket.key}-stem-${index}`}
                  x1={x}
                  y1={bracket.y}
                  x2={x}
                  y2={bracket.childYs[index]}
                  stroke={stemStroke}
                  strokeWidth={stemSelected ? 2 : 1}
                />
              );
            })}
            {bracket.showLabel ? (
              <text
                x={bracket.labelX}
                y={bracket.y - 4}
                textAnchor="middle"
                fontSize={TAXON_LABEL_FONT_SIZE}
                fontFamily="Open Sans, sans-serif"
                fontWeight={selected ? 700 : 400}
                fill={selected ? SPECIES_TAXON_SELECTED : '#222'}
              >
                {bracket.label}
                <title>{bracket.label}</title>
              </text>
            ) : null}
          </g>
        );
      })}
      {layout.leaves.map((leaf) => {
        const pressed = leaf.key === selectedKey;
        const selected = highlighted.has(leaf.key);
        const stroke = selected ? SPECIES_TAXON_SELECTED : '#444';
        const bracket = leaf.speciesBracket;
        return (
          <g
            key={leaf.key}
            data-testid={`species-taxon-${leaf.key}`}
            role="button"
            tabIndex={0}
            aria-pressed={pressed}
            aria-label={leaf.label}
            style={{ cursor: 'pointer' }}
            onClick={() => onToggle(leaf.key)}
            onKeyDown={(event) => toggleTaxon(event, leaf.key, onToggle)}
          >
            {bracket ? (
              <g data-testid={`species-gene-bracket-${leaf.key}`}>
                <path
                  d={speciesBracketPath(bracket.x1, bracket.x2, bracket.y, bracket.tick)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={12}
                >
                  <title>{leaf.label}</title>
                </path>
                <path
                  d={speciesBracketPath(bracket.x1, bracket.x2, bracket.y, bracket.tick)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={selected ? 2 : 1}
                  strokeLinejoin="miter"
                />
              </g>
            ) : null}
            <text
              transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rotation})`}
              textAnchor={leaf.textAnchor}
              dominantBaseline="middle"
              fontSize={leaf.fontSize}
              fontFamily="Open Sans, sans-serif"
              fontWeight={selected ? 700 : 400}
              fill={selected ? SPECIES_TAXON_SELECTED : '#222'}
            >
              {leaf.label}
              <title>{leaf.label}</title>
            </text>
          </g>
        );
      })}
    </g>
  );
};
