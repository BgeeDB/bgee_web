# Search Experiments, Annotations, and Processed Expression Values

Instructions on how to search and filter Bgee _experiments_, _raw data annotations_ and _processed expression values_, and information on the generated results table.

- [Introduction](#introduction 'Quick jump to this section')
- [Search Form](#search-form 'Quick jump to this section')
- [Filtering](#filtering 'Quick jump to this section')
- [Experiments](#experiments 'Quick jump to this section')
  - [Results Table](#results-table 'Quick jump to this section')
  - [Results Table - Within an Experiment](#result-table---within-an-experiment 'Quick jump to this section')
  - [Description of Results](#description-of-results 'Quick jump to this section')
- [Raw Data Annotations](#raw-data-annotations 'Quick jump to this section')
  - [Description of Results](#description-of-results-1 'Quick jump to this section')
- [Processed Expression Values](#processed-expression-values 'Quick jump to this section')
  - [Description of Results](#description-of-results-2 'Quick jump to this section')

## Introduction

Bgee data can be searched and filtered through the _Experiments_, _Raw data annotations_ and _Processed expression values_ pages. Each page shares a common search form and filtering options and will display a results table that can be exported. The search form, filtering options, and data in the results table are described in detail below.

To start a search, go to the _Search_ section of Bgee's homepage toolbar and select the _Experiments_, _Raw data annotations_ or _Processed expression values_ subsection. Once on a page, you can easily alternate between data types.

## Search Form

At the top of each data interface page (such as _Experiments_) you will find the form that you can fill in to select specific species, tissues, experiments, and more. The form works as follows:

To start your search click _Show Form_. After selecting your species of interest, the full form will become available. You can then specify all the parameters you want to filter.

Additionally, if you know the experiment or assay you are looking for, you can specify its ID or title on the right search bar called _Experiment or assay ID_.

The following filter options are available through the search form:

- **Species** (required): Species of interest, either the common name or the Latin name.
- **Gene** (required): Gene(s) of interest. You can search using the common name or by the gene identifier.
- **Tissue**: Tissue(s) of interest. You can search using the common name or the UBERON ID.
  - Checking the including substructures box will include all substructures (child terms) of the tissue(s) you selected.
- **Cell Type**: Cell type(s) of interest, either the common name or the Cell Ontology ID.
  - Checking the including substructures box will include all substructures (child terms) of the cell type(s) you selected.
- **Developmental and Life Stage**: Developmental/life stage(s) of interest, either using the common name or UBERON ID.
  - Checking the including child terms box will include all child terms of the developmental and life stage(s) you selected.
- **Strain and Ethnicity**: Strain(s) of interest, or in humans the ethnicity of interest. Bgee uses the UniProt controlled vocabulary of strains.
- **Sex**: Limit sex to male or female by checking the corresponding box.

After selecting all desired filters from the search form, click the _Submit_ button to populate the results table.

## Filtering

The data can be further filtered from the results table.

### Available filters

Filters can differ depending on the data page (_experiments_, _raw data annotations_, or _processed expression values_) and the data type (bulk RNA-seq, scRNA-seq, affymetrix, ISH, or EST).
The following filters can always be applied:

- **Species**: You can search using the NCBI taxon ID (e.g. 9606) or the common name of the species (e.g. human). Selection of multiple species is supported.
- **Anatomical entities**: Selection of multiple terms is supported. You can search using common terms, or the UBERON ID.
- **Developmental and life stage**: You can search using common names, or the UBERON or species specific (e.g. HsapDv for humans).
- **Sexes**: Select sex of interest. Multiple sexes can be selected.
- **Strains/Ethnicities**: Select strain(s)/ethnicity(ies) of interest. Multiple strains/ethnicities can be selected.

The following filters can be applied only on some data pages or data types:

- **Cell type**: Only available for single cell RNA-Seq data type (i.e. table scRNASeq). Selection of multiple terms is supported. You can search using common terms, or the Cell Ontology ID.
- **Experiments**: Available for all data types except ESTs, as such a concept does not exist for the EST data type. Select the experiment(s) of interest, either by the experiment name or the experiment ID. Multiple experiments can be selected.
- **Assays**: Available for all data types for _Raw data annotations_ and _Processed expression values_ data. Also available for _Experiments_ data of ESTs. Select the assay of interest. Can either be the assay name or the assay ID. Multiple assays can be selected.

### Apply filters

Once you select the filters you are interested in you can apply them by clicking on the _Apply filters_ button.

![](../img/doc/Raw-data-interface/postfilter-apply-filters.png#tutoimgborder)

### Number of filtered results

Once filters are applied the number of filtered results can be seen in red on the top right of the filtering section.

![](../img/doc/Raw-data-interface/postfilter-number-filtered-results.png#tutoimgborder)

### Remove filters

To remove a filter you can click on the cross on the right side of the filter name.

![](../img/doc/Raw-data-interface/postfilter-delete-one-filter.png#tutoimgborder)

Then click on the _Apply filters_ button.

It is also possible to remove all filters at once by clicking on the red trash icon to the right of the _Apply filters_ button.

![](../img/doc/Raw-data-interface/postfilter-delete-filters.png#tutoimgborder)

### Export of filtered results

Due to the number of potential entries in the result table, we do not support the export of all results at once. The _Export current page in TSV_ button will only export the results shown on the current page. However, it is possible to increase the number of entries displayed on the current page by selecting up to 1000 entries using the _Show X entries_ dropdown. You can export the entries of the current result table by clicking on the button _Export current page in TSV_.

![](../img/doc/Raw-data-interface/postfilter-update-number-result-entries.png#tutoimgborder)

## Experiments

The experiments tab allows you to retrieve the experiments in Bgee that match the specific conditions you are interested in (e.g. species, tissue, developmental stage, etc.) and retrieve library-specific expression values.

We will focus this tutorial on the Mus musculus experiment ERP012910. To access the page click on the _Search_ tab in the toolbar then click _Raw data annotated and processed_ which will bring you to the Experiments search page. Type in the experiment of interest (ERP012910) in the right search form entitled "Experiment or assay ID" and click _Submit_. Next, click the ERP012910 link in the Experiment ID column to access the ERP012910 experiment page. The video below details how to reach the experiment page in Bgee 15.0. Additionally, you can access the page directly at https://www.bgee.org/experiment/ERP012910.

![](../img/doc/Raw-data-interface/Fig1-Experiment-page-howtogetthere.gif#tutoimgborder)

Following the previously described steps will bring you to this page.

![](../img/doc/Raw-data-interface/Fig0-Experiment-page.png#tutoimgborder)

Alternatively, if you are not looking for a particular experiment but want to search all experiments in Bgee that match specific conditions you are interested in (e.g. species, tissue, developmental stage, etc.), you can simply fill out the [search form](#search-form) as described above and click on _Submit_.

### Results table

The result table at the bottom of the page, which gets populated after searching for a specific experiment ID or filling out the search form, contains 4 columns. You can easily access the more detailed Experiment information by clicking on any Experiment ID name contained in the results table.

The four columns contained in the table are:

- **Experiment ID**: refers to a unique identifier assigned to the specific experiment done in the study. You can click on this link to access further information on an experiment. For EST data, the _Library ID_ is used instead of the _Experiment ID_.
- **Experiment name**: defines the title used to designate this experiment.
- **Description**: a more detailed description of how the experiment was done and the aims of the project.
- **Link to raw data annotations**: this link will allow you to see all libraries included in this experiment (inside Bgee) through our raw data annotations page (for further details on this page, see [Raw data annotations](#raw-data-annotations) section).

### Experiment general information

The top section of the experiment page contains general information about the experiment selected. You can find the title of the experiment, the experiment ID, the technology used, a brief description of the experiment, and the original data source with a link to where you can find the relevant data and information outside Bgee.

You may also be interested in the _Download all assays_ button which allows the user to retrieve the processed expression values for all tested genes in all the libraries for that experiment.

![](../img/doc/Raw-data-interface/Fig2-General-info-headers.png#tutoimgborder)

### Result table - within an experiment

The bottom section of the page contains the results table where each row represents one library from the selected experiment.

![](../img/doc/Raw-data-interface/Fig3-Results-table.png#tutoimgborder)

The top of the results page has a filter option that filters all the columns using the value(s) you provide. There is also a _Show X entries_ option where you can change the number of rows displayed in the results table, and you can browse the different tabs of results by clicking the page number or the _Next/Previous_ button on the right.

As with the _Raw data annotations_ or _Processed expression values_ pages, the columns of the results table will depend on the data type selected on top of the filter options. We describe in the _Column description_ a definition of all columns present in at least one data type.

### Description of results

- **Library ID:** Unique library identifier for the sequenced or analyzed sample.
- **Anat. entity ID:** Controlled vocabulary ID (UBERON, CL or species specific term) describing anatomical localization of the sample. Clicking on the Uberon link brings you to the Ontology search page for that Uberon ID where you will be able to see all related substructures or parent terms.
- **Anat. entity name:** Common name of the anatomical localization of the sample, for example, "lung".
- **Stage ID:** Controlled vocabulary ID (UBERON or species specific term) describing the developmental and life stage of the sample. Clicking on the associated link will give you more information about the term, in addition to the parent and child terms.
- **Stage name:** Common name of the developmental and life stage of the sample, for example, "adult". The terms can be highly precise, such as 4 days old, or if the authors did not use highly precise terms, the most precise parent term is used, such as "life cycle".
- **Sex:** Annotation of the sex of the sample (male, female, any, hermaphrodite, mixed).
- **Strain/Ethnicity:** Annotation of the specific strain/ethnicity from which the samples were taken, for example C58/J or BXD6.
- **Species:** Describes the species name in binomial nomenclature (scientific name).
- **Technology:** Method used to generate the raw gene expression measurements.
- **Sequencing platform:** Exact instrument name used for the sequencing.
- **Sequenced transcript part:** Which part of the fragments were sequenced. The possible values are: "FULL_LENGTH" where all parts of the transcripts are sequenced, "3'" where the 3' end of the transcripts are sequenced, or "5'" where the 5' end of the transcripts are sequenced.
- **Fragmentation:** This number represents the size of the RNA fragmentation.
- **Run sequencing type:** Specifies whether the sequencer reads the fragments from only one end to the other (single) or from both sides of the fragment (paired).
- **Total read count:** Total number of reads for the annotated sample.
- **Mapped read count:** Number of reads that Bgee was able to map to the reference ensembl transcriptome (ensembl 102).
- **Total UMI count:** Total number of individual RNA molecules (UMI) for the annotated sample. Only applicable for libraries producing UMIs.
- **Mapped UMI count:** Number of UMIs that could be mapped to the transcriptome. Only applicable for libraries producing UMIs.
- **Distinct rank count:** When performing a fractional ranking of the genes in the annotated sample, based on their expression level, number of distinct ranks observed, to have a value of the power for distinguishing expression levels. Used as a weight to compute a weighted mean rank across samples for each gene and compute expression scores in Bgee.
- **Max rank:** When performing a fractional ranking of the genes in the annotated sample, based on their expression level, maximum rank attained in the sample. Used to normalize ranks across samples and compute expression scores in Bgee.
- **Link to processed expression values:** The "Browse results" link allows you to access the processed expression values for this library. It will include the expression level and expression p-value for each available gene.

## Raw data annotations

The raw data annotations tab allows you to retrieve all libraries in Bgee that match your selected conditions and access their fully annotated raw (unprocessed) data. Similar to the _experiments_ and _processed expression values_ pages, you can fill out the form at the top of the page to specify in which species, tissue, developmental stage, or any other condition you want to see the available data for. You may also just want to select a specific experiment on the top right next to the form and see all available libraries for that experiment.

![](../img/doc/Raw-data-interface/Raw-data-annotation_homepage.png#tutoimgborder)

### Results table

As with the _Experiments_ or _Processed expression values_ page, the columns of the results table will depend on the data type selected on top of the filter options. We describe in the _Column description_ a definition of all columns present in at least one data type.

### Description of results

- **Experiment ID**: refers to a unique identifier assigned to the specific experiment done in the study. You can click on this link to access further information on an experiment.
- **Experiment name**: defines the title used to designate this experiment.
- **Library ID:** Unique library identifier for the sequenced or analyzed sample.
- **Anat. entity ID:** Controlled vocabulary ID (UBERON, CL or species specific term) describing anatomical localization of the sample. Clicking on the Uberon link brings you to the Ontology search page for that Uberon ID where you will be able to see all related substructures or parent terms.
- **Anat. entity name:** Common name of the anatomical localization of the sample, for example, "lung".
- **Stage ID:** Controlled vocabulary ID (UBERON or species specific term) describing the developmental and life stage of the sample. Clicking on the associated link will give you more information about the term, in addition to the parent and child terms.
- **Stage name:** Common name of the developmental and life stage of the sample, for example, "adult". The terms can be highly precise, such as 4 days old, or if the authors did not use highly precise terms, the most precise parent term is used, such as "life cycle".
- **Sex:** Annotation of the sex of the sample (male, female, any, hermaphrodite, mixed).
- **Strain/Ethnicity:** Annotation of the specific strain/ethnicity from which the samples were taken, for example C58/J or BXD6.
- **Species:** Describes the species name in binomial nomenclature (scientific name).
- **Technology:** Method used to generate the raw gene expression measurements.
- **Sequencing platform:** Exact instrument name used for the sequencing.
- **Sequenced transcript part:** Which part of the fragments were sequenced. The possible values are: "FULL_LENGTH" where all parts of the transcripts are sequenced, "3'" where the 3' end of the transcripts are sequenced, or "5'" where the 5' end of the transcripts are sequenced.
- **Fragmentation:** This number represents the size of the RNA fragmentation.
- **Run sequencing type:** Specifies whether the sequencer reads the fragments from only one end to the other (single) or from both sides of the fragment (paired).
- **Total read count:** Total number of reads for the annotated sample.
- **Mapped read count:** Number of reads that Bgee was able to map to the reference ensembl transcriptome (ensembl 102).
- **Total UMI count:** Total number of individual RNA molecules (UMI) for the annotated sample. Only applicable for libraries producing UMIs.
- **Mapped UMI count:** Number of UMIs that could be mapped to the transcriptome. Only applicable for libraries producing UMIs.
- **Distinct rank count:** When performing a fractional ranking of the genes in the annotated sample, based on their expression level, number of distinct ranks observed, to have a value of the power for distinguishing expression levels. Used as a weight to compute a weighted mean rank across samples for each gene and compute expression scores in Bgee.
- **Max rank:** When performing a fractional ranking of the genes in the annotated sample, based on their expression level, maximum rank attained in the sample. Used to normalize ranks across samples and compute expression scores in Bgee.
- **Link to processed expression values:** The "Browse results" link allows you to access the processed expression values for this library. It will include the expression level and expression p-value for each available gene.
- **Cell type ID**: ID of the cell type of the sample. Clicking the link will give you more information on that cell type by bringing you to the Ontology origin where you can see parent and child terms or cell type function.
- **Cell type name**: Common name of the cell type of the sample such as "embryonic cell".
- **Fractionation**: Denotes where the transcripts are extracted from. There are two possible values, the cell or the nuclei.
- **Chip ID**: Identifier of the Affymetrix chip.
- **Evidence ID**: Specific identifier of one results from an in situ hybridization experiment.

## Processed expression values

The _Processed expression values_ tab allows you to gather gene expression information processed using the Bgee pipeline that matches your selected conditions.
The [form](#search-form) on top of the page allows you to limit which processed expression data is populated in the results table. It is also possible to filter data present in the result table
using the [filtering section](#filtering).

### Results table

The columns of the results table will depend on the data type selected. We describe in the _Column description_ section all columns present in at least one data type.

### Description of results

- **Experiment ID**: refers to a unique identifier assigned to the specific experiment done in the study. You can click on this link to access further information on an experiment.
- **Library ID**: Unique library identifier for the sequenced or analyzed sample.
- **Library name**: defines the title used to designate this experiment.
- **Chip ID**: Identifier of the Affymetrix chip.
- **Evidence ID**: Specific identifier of one results from an in situ hybridization experiment.
- **Probeset ID**: Identifier of the Affymetrix probeset.
- **EST ID**: Identifier of the Expressed Sequence Tag.
- **Gene ID**: Identifier of the gene. Clicking on the identifier opens the [Bgee gene page](/support/tutorial-gene-page).
- **Gene name**: name of the gene.
- **Expression level**: the quantitative expression level of the call.
- **Expression level unit**: The unit of the quantitative expression level for RNA-Seq. Can be transcript per million (tpm) for bulk RNA-Seq or full-length single cell RNA-Seq or count per million (cpm) for target based single cell RNA-Seq.
- **Signal intensity**: Log transformation of normalized Affymetrix probeset signal intensities.
- **Read count**: number of reads mapped to this gene.
- **UMI count**: number of Unique Molecular Identifier (UMI) mapped to this gene from the Bgee target-based RNA-Seq pipeline.
- **Expression p-value**: p-value of the expression call. The lower the p-value the higher we trust the gene to be significantly expressed. For each data type, we identify whether the gene expression level is significantly above the background transcriptional and experimental noise. For instance, for RNA-Seq data, the expression level of selected intergenic regions is used to estimate the background noise in each library, leading to obtain one p-value for the significance of expression for each gene in the library. More specifically for single-cell RNA-Seq data, data are pseudo-bulked per library and cell type to obtain more signal, no statistical present/absent calls are produced per **cell**, but per **cell population** (gene count matrices per cell can still be retrieved, in H5AD format, see the [experiment search](/search/raw-data) to retrieve such data).
- **Cell type ID**: ID of the cell type of the sample. Clicking the link will give you more information on that cell type by bringing you to the Ontology origin where you can see parent and child terms or cell type function.
- **Cell type name**: Common name of the cell type of the sample such as "embryonic cell".
- **Anat. entity ID**: Controlled vocabulary ID (UBERON, CL or species specific term) describing anatomical localization of the sample. Clicking on the Uberon link brings you to the Ontology search page for that Uberon ID where you will be able to see all related substructures or parent terms.
- **Anat. entity name**: Common name of the anatomical localization of the sample, for example, "lung".
- **Stage ID**: Controlled vocabulary ID (UBERON or species specific term) describing the developmental and life stage of the sample. Clicking on the associated link will give you more information about the term, in addition to the parent and child terms.
- **Stage name**: Common name of the developmental and life stage of the sample, for example, "adult". The terms can be highly precise, such as 4 days old, or if the authors did not use highly precise terms, the most precise parent term is used, such as "life cycle".
- **Sex**: Annotation of the sex of the sample (male, female, any, hermaphrodite, mixed).
- **Strain/Ethnicity**: Annotation of the specific strain/ethnicity from which the samples were taken, for example C58/J or BXD6.
- **Species**: Describes the species name in binomial nomenclature (scientific name).
