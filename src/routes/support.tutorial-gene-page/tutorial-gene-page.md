# Gene Search and Gene Page
This tutorial shows how to search for genes in Bgee and describes the information you will find on a gene page including gene expression, orthologs, paralogs, and general information about the gene. We use the mouse CDK5 gene (ENSMUSG00000028969) from Bgee release 15.0 as an example throughout the tutorial. The link to the most current version of the gene page for ENSMUSG00000028969 is found [here](/gene/ENSMUSG00000028969).

*   [Gene Search](#gene-search "Quick jump to this section")
*   [Gene Page](#gene-page "Quick jump to this section")
    *   [General information](#general-information "Quick jump to this section")
    *   [Expression and reported absence of expression](#expression-and-reported-absence-of-expression "Quick jump to this section")
    *   [Orthology and paralogy](#orthology-and-paralogy "Quick jump to this section")
    *   [Cross-references](#cross-references "Quick jump to this section")

## Gene search
You can search for genes based on their name, description, synonyms, identifiers, or cross-references.

![](../img/doc/gene-search/Fig01_Gene-search.gif#tutoimgborder)

Search with a gene name, e.g. **CDK5**, in upper or lowercase.

Select the first match **Cdk5**. You can now see the corresponding search results.

![](../img/doc/gene-search/Fig02_Gene-search-results.png#tutoimgborder)

If your search returns several entries, you can navigate between them in different ways:
- Between result pages with the page numbers at the bottom right of the result table.
- Change the number of entries displayed per page with the _Show **N** entries_ at the top right of the result table.
- Alternatively, you can filter the result entries with the _Filter_ box at the top left of the result table, e.g. with a species name.

![](../img/doc/gene-search/Fig03_Gene-search-headers.png#tutoimgborder)


If you search with a specific term like an identifier (ex. ENSMUSG00000028969), your gene result search will be more precise.

![](../img/doc/gene-search/Fig04_search-with-identifier.gif#tutoimgborder)


You can reach the species specific gene page by clicking on the **Gene ID** or the **Name** links in the gene result table.
You can reach the species page by clicking on the **Organism** link in the gene result page.

![](../img/doc/gene-search/Fig05_gene-page-linked-rows.png#tutoimgborder)


The Bgee gene page is also directly accessible from the UniProt website, or from Wikipedia:
- https://www.uniprot.org/uniprotkb/P49615/entry#expression
- https://en.wikipedia.org/wiki/Cyclin-dependent_kinase_5 (_Show_ RNA expression pattern)

The Bgee gene result page is directly accessible from the Expasy website:
- https://www.expasy.org/search/cdk5

## Gene page
The gene page is the main page for a gene and includes information on gene expression, orthologs, paralogs, and general information about the gene.

### General information
This section provides important details about your selected gene, including its gene identifier, common name, a concise description, gene synonyms, the count of orthologs observed in various species, the count of paralogs within this species, and a hyperlink to access the processed expression values associated with the gene.

![](../img/doc/gene-search/Fig06_species-gene-page.png#tutoimgborder)


E.g. the gene ENSMUSG00000028969, also known as Cdk5, encodes the cyclin-dependent kinase 5 protein in _Mus musculus_ (mouse). The gene has been identified to have 45 orthologs in different species, and possesses 196 paralogs within the mouse genome. Access to processed expression values for Cdk5 allows us to explore its patterns in various tissues and conditions



### Expression and reported absence of expression
The expression and absence of expression sections on each gene page provide a ranked list of conditions where the expression or absence of expression of a gene has been reported: the present/absent expression calls. The conditions with significant expression (present expression calls) are reported in the "Expression" section, the conditions with a reported absence of expression (absent expression calls) are in the section "reported absence of expression".

The present/absent expression calls are produced using statistical tests specific to each data type, to identify whether the gene expression level is significantly above the background transcriptional and experimental noise. See the main [Bgee publications](/about/publications) for details. For instance, for RNA-Seq data, the expression level of selected intergenic regions is used to estimate the background noise in each library, leading to obtain one p-value for the significance of expression for each gene in each library. These p-values are then merged and corrected for multiple testing, to provide a definitive FDR-corrected result for each gene in each condition. This result per gene and condition takes into account all produced p-values, from all available data for all requested data types, in this condition and all its children conditions. More specifically for single-cell RNA-Seq data, data are pseudo-bulked per library and cell type to obtain more signal, no statistical present/absent calls are produced per **cell**, but per **cell population** (gene count matrices per cell can still be retrieved, in H5AD format, see the [experiment search](/search/raw-data) to retrieve such data).

The present/absent calls are then ranked using the Bgee expression score method, in order to provide first the most relevant conditions of expression for each gene. Again, specific methods are used for each data type, see the main [Bgee publications](/about/publications) for details. Briefly, the expression scores are based on non-parametric statistics, where conditions are ranked based on the gene expression levels. These ranks are then normalized across conditions, genes, and data types, and transformed into an expression score going from 0 (= low expression) to 100 (= high expression) for a more intuitive use. This non-parametric statistics allow comparison of gene expression in a quantitative manner across species and conditions, without requiring batch-correction procedures.

By default, the gene page reports this information for each anatomical localization only. For each present/absent expression call, are provided:
* Anatomical entity: the localization of the call (where the gene is detected either as present or as absent). It can point to simply an anatomical structure, or to a cell type, or to the composition of a cell type in a specific anatomical structure.
* the FDR-corrected p-value of the present/absent call.
* its expression score
* an overview of the data types supporting it
* and a link to browse the source data that allowed to produce it.

![](../img/doc/gene-search/Fig08_Expression-tab-gene-page.png#tutoimgborder)


Expression calls can be re-grouped by any of the following condition parameters, alone or in any combination:
* anatomical entity and cell type
* developmental and life stage
* sex
* strain/ethnicity

![](../img/doc/gene-search/Fig09_Expression-headers-gene-page.png#tutoimgborder)


It is also possible to filter by data types/techniques (Affymetrix, EST, RNA-Seq, etc.) used to produce the expression calls. By default, all are selected.

![](../img/doc/gene-search/Fig10_Expression-Data-types.png#tutoimgborder)


The data types supporting a call are reported in the column "Sources". A green box indicates the presence of data in this condition for this gene for the related data type, a grey box indicates no data for the related data type.
* "R" stands for bulk RNA-Seq
* "SC" for single-cell RNA-Seq
* "A" for Affymetrix
* "I" for in situ hybridization
* "E" for Expressed Sequence Tag (EST)


It is possible to view/retrieve the processed data used to produce each call by following the "see source data" link in the "Link to source data" column. More information is provided in the **documentation to retrieve raw data annotations and processed expression values**.

![](../img/doc/gene-search/Fig11_retrieve-processed-data.png#tutoimgborder)


### Orthology and paralogy

Bgee gene homology information is retrieved from the [OMA SPARQL endpoint](https://sparql.omabrowser.org/lode/sparql).
They correspond to one-to-one homologs for each pair of species in Bgee.

#### Orthologs

Orthology information is presented at taxon levels corresponding to the least common ancestor taxon for which orthologs are found in Bgee species.
For the Mus musculus gene [Cdk5](/gene/ENSMUSG00000028969#orthologs), orthologs are found at 10 different taxon levels, each one corresponding to one line in the result table.

![](../img/doc/gene-search/Fig12_Orthologs.gif#tutoimgborder)


For this gene the most precise taxon is Murinae and the highest level one is Bilateria. At Murinae taxon level, Cdk5 has one ortholog gene (column *Gene(s)*) coming from one species (column *Species with orthologs*).
Clicking on the *See details* column allows you to see details of species and genes. At Murinae level, the only orthologous gene is Cdk5 (ENSRNOG00000008017) from _Rattus norvegicus_.

![](../img/doc/gene-search/Fig13_orthologs-tab-explanation.png#tutoimgborder)

At Bilateria level the same gene has 45 orthologs coming from 44 species. Clicking on the *See details* column allows us to see that each one of the 44 species has one ortholog, except Salmon that have 2 orthologs.

![](../img/doc/gene-search/Fig14_orthologs-filter.gif#tutoimgborder)

You can filter the result entries with the _Filter_ box at the top left of the result table. You can for instance filter using a taxonomic level, a gene ID or a species name.

![](../img/doc/gene-search/Fig15_Orthologs-expression-comparison.png#tutoimgborder)

You can run an expression comparison analysis for all ortholog genes at one taxonomic level by clicking on the link "Compare expression" of the *Expression comparison* column. For instance, clicking on the link "Compare expression" at the Bilateria level will run an expression comparison analysis for the 46 genes (45 orthologs + the gene itself) at that taxonomic level.


#### Paralogs

Paralogy information is presented at taxon levels corresponding to the least common ancestor taxon for which paralogs are found in Bgee species.
For the Mus musculus gene [Cdk5](/gene/ENSMUSG00000028969#paralogs), paralogs are found at 2 different taxon levels (Metazoa and Opisthokonta), each one corresponding to one line in the result table.

![](../img/doc/gene-search/Fig16_Paralogs-see-details.gif#tutoimgborder)


At Metazoa level, Cdk5 has four paralog genes (column *Gene(s)*).
Clicking on the *See details* column allows you to see names and IDs of these genes.

![](../img/doc/gene-search/Fig17_paralogs-filter.gif#tutoimgborder)

You can filter the result entries with the Filter box at the top left of the result table. You can for instance filter using a taxonomic level, a gene ID or a species name.

![](../img/doc/gene-search/Fig18_Paralogs-expression-comparison-analysis.png#tutoimgborder)

You can run an expression comparison analysis for all paralog genes at one taxonomic level by clicking on the link "Compare expression" of the *Expression comparison* column. For instance, clicking on the link "Compare expression" at the Opisthokonta level will run an expression comparison analysis for the 197 genes (196 paralogs + the gene itself) at that taxonomic level.

#### Download one-to-one homologs

All one-to-one orthologs generated from OMA SPARQL endpoint for species present in Bgee are available [here](https://bgee.org/ftp/current/homologous_genes/OMA_orthologs.zip).
All one-to-one paralogs generated from OMA SPARQL endpoint for species present in Bgee are available [here](https://bgee.org/ftp/current/homologous_genes/OMA_paralogs.zip).

### Cross-references

![](../img/doc/gene-search/Fig19_Cross-ref.png#tutoimgborder)

The section highlighted in the Figure shows several links to external resources. The first column is the resource name and the second column shows links that correspond to the current searched gene (e.g., Cdk5 in mouse). These links are named according to the identifiers defined by the external resource. For example, [ENSMUSG00000028969](https://nov2020.archive.ensembl.org/Mus_musculus/Gene/Summary?g=ENSMUSG00000028969) is the [Ensembl database](https://www.ensembl.org) identifier for the mouse's Cdk5 gene. In case not all links are displayed, click on the (+) button to see more.

