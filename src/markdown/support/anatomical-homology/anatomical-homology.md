# Anatomical Homology

The [Anatomical Homology tool](https://www.bgee.org/search/anatomical-homology) can be used to identify anatomical structures in different species that are believed to be derived from a common ancestral structure. In the next sections, we provide a tutorial on how to use the Anatomical Homology tool. This tutorial is based on the Bgee release 15.0.

- [Quick start](#quick-start)
- [Background](#background)
- [How to use the Anatomical Homology tool](#how-to-use-the-anatomical-homology-tool)
- [Description of Results](#description-of-results)

![](../img/doc/anatomical-homology/anatomical-homology-header.webp#tutoimgborder)

## Quick start

In this example, we will retrieve homologous entities for the human lung in zebrafish.

1. Enter the Uberon ID for lung. If you do not know the Uberon ID, you can find it on the [OLS Uberon site](https://www.ebi.ac.uk/ols/ontologies/uberon) by searching "lung". This will give you the ID UBERON:0002048.
2. Select your species of interest by clicking the corresponding checkbox. Here we will select _Homo sapiens_ for human and _Danio rerio_ for zebrafish.
3. Click **Search** to run the anatomical homology tool.

![](../img/doc/anatomical-homology/complete-form.webp#tutoimgborder)

After your request finishes loading, the results table will be displayed. It has three important columns:

- **Anatomical entities**: the homologous anatomical entities with their common names and Uberon IDs. Clicking on an anatomical entity will bring you to the corresponding Uberon page, where you can learn more about the anatomical entity.
- **Ancestral taxon**: the taxon where the organ(s) first appeared in animal evolution.
- **Presence among selected species**: the selected species where the homology assertion is valid.

Additionally, the top of the results table displays the least common ancestral clade of the species you selected. In this example, the least common ancestor is _Euteleostomi_.

![](../img/doc/anatomical-homology/results-table.webp#tutoimgborder)

You can filter the results table using the filter free-text box on the top left of the results table. You can also change the number of entries using the _Show N entries_ box on the top right of the results table.

## Background

The anatomical homology tool can be used to identify anatomical structures in different species that are believed to be derived from a common ancestral structure. This is based on the concept of [historical homology](https://www.ebi.ac.uk/ols/ontologies/hom/terms?iri=http%3A%2F%2Fpurl.obolibrary.org%2Fobo%2FHOM_0000007): a homology that is defined by common descent. This process is described in more detail on the [anatomical similarity annotation page](https://github.com/BgeeDB/anatomical-similarity-annotations/wiki/Similarity-annotations).

The [UBERON cross-species anatomy ontology](https://www.ebi.ac.uk/ols/ontologies/uberon) IDs must be used as input for anatomical entities. Uberon IDs can be easily identified by searching the organ name on the [OLS Uberon site](https://www.ebi.ac.uk/ols/ontologies/uberon). You can input multiple Uberon IDs by listing them with a space between each ID.

This tool can be used to identify homologous anatomical structures in the selected species or to validate the presence of the anatomical structures in the species you selected. If no homologous structures exist between the selected species the results table will display "No data", and the anatomical structures without a match will be listed at the bottom of the page with "Anatomical entities without anatomical homology: organ name (UBERON ID)".

Currently, the list of available species only includes species with expression data in Bgee. Multiple species can be selected but by definition, homology relationships must involve the comparison between at least 2 species.

## How to use the Anatomical Homology tool

1. Use the [OLS Uberon site](https://www.ebi.ac.uk/ols/ontologies/uberon) to search for your organs of interest and retrieve the Uberon ID(s).
   - You can use a list of Uberon IDs by putting a space between each ID.
2. Select at a minimum 2 species from the species list by clicking on the species name or the corresponding checkbox. All selected species will display a blue check next to their name.
3. Click search to run the anatomical homology tool.

## Description of Results

![](../img/doc/anatomical-homology/full-results-table-numbered.webp#tutoimgborder)

1. **Least common ancestor of provided species**: gives the clade to which species you selected belongs.
2. **Anatomical entities**: the homologous anatomical entities with their common names and Uberon IDs. Clicking on an anatomical entity will bring you to the corresponding Uberon page, where you can learn more about the anatomical entity.
   - The line may display multiple anatomical entities if the searched organ is present in different but homologous structures in the species you selected.
3. **Ancestral taxon**: the taxon where the organ(s) first appeared in animal evolution.
4. **Presence among selected species**: the selected species where the homology assertion is valid.
5. **Rows in results table**: Each line of results displays the anatomical structure names as provided by the Uberon IDs, and reports the ancestral taxon name with its NCBI taxon ID in brackets.
6. **Anatomical entities without anatomical homology**: when you select an anatomical entity that does not have anatomical homology in the species selected it will be displayed here.
7. **Filter**: allows filtering of organs, Uberon IDs, or species in the results table.
8. **Show N entries**: change the number of rows shown in the results table.
