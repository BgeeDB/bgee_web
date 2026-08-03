# TopAnat: an Anatomical Entity (Uberon) Enrichment Tool

- [Introduction](#introduction 'Quick jump to this section')
- [Quick Start](#quick-start 'Quick jump to this section')
- [Description of the Results](#description-of-the-results 'Quick jump to this section')
  - [Results Table](#results-table 'Quick jump to this section')
- [How to Properly Choose Your Background](#how-to-properly-choose-your-background 'Quick jump to this section')
- [Advanced Options](#advanced-options 'Quick jump to this section')
  - [Filtering of Expression Data](#filtering-of-expression-data 'Quick jump to this section')
  - [Algorithm Parameters](#algorithm-parameters 'Quick jump to this section')
- [Examples](#examples 'Quick jump to this section')

## Introduction

TopAnat is an anatomical entity enrichment analysis tool based on the [topGO R package](https://bioconductor.org/packages/release/bioc/html/topGO.html).

It is similar to a GO enrichment test but rather than using Gene Ontology annotations it is based on anatomical [Uberon](http://obophenotype.github.io/uberon/about/) annotations manually curated by Bgee. For example, given a set of genes that are up-regulated under certain conditions, TopAnat will find which anatomical entities have over or under-represented expression using annotations for that gene set.

On top of the page from left to right you have

- A **_Recent Jobs_** button allows you to look at the history of analysis you recently ran.
- A **_Documentation_** button linking to the current documentation
- **_Examples_** with buttons numbered from 1 to 5, each corresponding to an already processed example. Click on a button to see the result of the anatomical enrichment analysis with the corresponding set of genes.

![](../img/doc/topAnat/topAnat_header.png#tutoimgborder)

The main section is the **_Gene list_**. This is where identifiers of your genes of interest must be entered. Be careful to provide gene identifiers (e.g. ENSG00000244734) and not gene names (e.g. HBB).

![](../img/doc/topAnat/topAnat_geneList.webp#tutoimgborder)

The **_Advanced Options_** section is closed by default.

![](../img/doc/topAnat/topAnat_advancedOptionsTitle.webp#tutoimgborder)

To open that section, click on the corresponding dark grey banner. It contains options allowing you to tune both Bgee data used to process the enrichment analysis and the parameters of the algorithm itself. Read the [Advanced options](#advanced-options) section for more details.
![](../img/doc/topAnat/topAnat_advancedOptions.webp#tutoimgborder)

Below the Advanced Options section, the **_Email_** field allows you to receive an email once the analysis is complete. The **_Job description_** field allows you to give a title to your analysis.

![](../img/doc/topAnat/topAnat_emailAndTitle.webp#tutoimgborder)

At the bottom of the page the **_Submit your Job_** button allows you to submit an analysis. It is greyed out by default and becomes clickable once genes have been entered.

![](../img/doc/topAnat/topAnat_greyedSubmit.webp#tutoimgborder) ![](../img/doc/topAnat/topAnat_submit.webp#tutoimgborder)

## Quick start

The entry point of TopAnat is a set of genes from one species you are interested in. In this quick start tutorial, we will focus on a set of pigmentation genes from rabbits. TopAnat will be used to detect in which anatomical entities the presence of expression of those genes is over or under-represented.

TopAnat uses gene identifiers (e.g. ENSG00000244734) and automatically detects the species of interest. You have to provide one gene identifier per line without space or delimiter, as shown in the screenshot below. The list of gene identifiers used in this example is available [here](https://bgee.org/ftp/bgee_v15_1/documentation/pigmentation_geneIds_rabbit.txt).

![](../img/doc/topAnat/topAnat_foregroundIds.png#tutoimgborder)

Once you enter your list of genes the web interface is updated.

On top of your gene list, you can now see a sentence describing the number of genes you entered and the corresponding species. You can also see a picture of the species.

![](../img/doc/topAnat/topAnat_geneListSpecies.webp#tutoimgborder)

Additionally, two new subsections appeared: **_Background_** and **_Analysis options_**.

The **_Background_** subsection allows the user to select the universe of the analysis, which is described in the [Properly choose your background](#how-to-properly-choose-your-background) section of this documentation. In our example, we keep the default background which corresponds to all genes from the species.

![](../img/doc/topAnat/topAnat_backgroundDefault.webp#tutoimgborder)

The **_Analysis options_** subsection allows the user to limit the analysis to expression data coming from a subset of the datatypes integrated in Bgee. In this example, we want to use as much data as possible and then do not modify the default behavior which is to select expression data coming from all available datatypes. To remove one datatype from your TopAnat analysis uncheck the corresponding datatype checkbox.

![](../img/doc/topAnat/topAnat_analysisOptions.webp#tutoimgborder)

Now add your email address to receive an email once the processing of the analysis is over and enter the title `Pigmentation genes in rabbit` to easily find the analysis when using the **_Recent jobs_** button. This title will also be used to name the email you will receive.

![](../img/doc/topAnat/topAnat_emailAndTitleFilled.webp#tutoimgborder)

You are now ready to run TopAnat. Click on the **_Submit your job_** button and wait for your analysis to be processed on our server.

![](../img/doc/topAnat/topAnat_submit.webp#tutoimgborder)

A TopAnat analysis can take up to 1 hour to finish processing. To leave the page without losing the results you have 2 options:

- enter your email address: you will then receive an email containing a link to the results of your analysis
  ![](../img/doc/topAnat/topAnat_emailReceived.webp#tutoimgborder)

- wait to see the page shown below and then bookmark the permanent URL of this page by clicking on **_Copy permanent link_** in the footer of the page
  ![](../img/doc/topAnat/topAnat_bookmark.png#tutoimgborder)

## Description of the results

Once the processing is complete you will automatically be redirected to the result section of the web interface.

The header of this results section consists of a blue banner containing a sentence describing that the request was successful, the number of results, and the number of analyses launched.

![](../img/doc/topAnat/topAnat_resultHeader.png#tutoimgborder)

Then, on top of the result table, you have the title of your analysis written in red.

![](../img/doc/topAnat/topAnat_resultTitle.webp#tutoimgborder)

Below the title on the left side, there is a light red button that allows you to download an archive containing the results of your analysis, as well as all the data to reproduce them. The following files are included in the download:

- **_topAnat*AnaEntitiesRelationships*_**: file containing direct relations between Uberon terms. It is a 2 column file where terms in the first column are direct descendants (using a _part of_ or _is a_ relations) of the term in the right column
- **_topAnat*AnaEntitiesNames*_**: a file containing the IDs (column 1) and names (column 2) of all Uberon terms used in the topAnat analysis
- **_topAnat*GeneToAnaEntities*_**: a 2-column file containing the mapping between gene IDs (column 1) and the Uberon terms (column 2) the genes are annotated with
- **_topAnat_Params.txt_**: the parameters of your analysis
- **_topAnat_functions.R_**: R functions used to run topAnat
- **_topAnat_script.R_**: R script to reproduce the data
- **_topAnat_log.R_console_**: the log resulting from running the R script on our server
- **_topAnat_results.tsv_**: the results table stored as a tabulated file containing the same information found in the table present on our website

Below the title in the middle, there is a **_Filter_** field which allows you to perform a case-sensitive filter on all columns of the result table. For instance, in the _Pigmentations genes in rabbit_ results coming from the analysis of the [Quick start](#quick-start) section, filtering with the word _skin_ will return all anatomical entities containing the word skin and will show 5 results in the table.

![](../img/doc/topAnat/topAnat_filterResults.png#tutoimgborder)

To the right of the Filter field, a **_TSV_** button allows you to download the results table as a tabulated file.

In the same line, on the right side, you can change the number of lines visible in the results table. The default value is 20 but can be increased up to 1000.

### Results table

the result table is composed of 8 columns:

- **_Anat Entity ID_** : the ID of the Uberon term
- **_Anat Entity Name_** : the name of the Uberon term
- **_Annotated_**: total number of genes annotated with this term from the background list of genes. More information about background is available in [Properly choose your background](#how-to-properly-choose-your-background)
- **_Significant_**: actual number of annotations to this Uberon term from our _Gene list_
- **_Expected_**: expected number of annotations to this Uberon term from our _Gene list_ based on the number of annotations to that term from the background.
- **_Fold Enrichment_**: the ratio between Significant and Expected annotated genes.
- **_P value_**: probability of seeing at least the _Significant_ number of genes annotated to this Uberon term, given the proportion of genes in the background genome that are annotated to that Uberon term
- **_Fdr_**: false discovery rate

## How to properly choose your background

The background, also called the universe, corresponds to the list of genes you want to consider in your analysis.

By default, the gene universe considered for the TopAnat enrichment analysis is all genes with data in Bgee for the selected species.

Let's imagine that you want to answer the question: where (which anatomical entities) are human genes enriched that are both present and differentially expressed in testis and ovary?

- You will first select genes that are expressed in both testis and ovary.
- Then, you will run a differential analysis on this list of genes (e.g. using edgeR).

In this naive example, your topAnat _Gene list_ will be the list of differentially expressed genes, and your background will consist of the list of all genes expressed in both testis and ovary.

It is possible to provide a custom gene universe as a list of gene IDs. To do so, click on the **_Custom data_** button.

![](../img/doc/topAnat/topAnat_backgroundButtonHuman.webp#tutoimgborder)

As for your _Gene list_ you have to enter one gene per line without space, quotes, or any delimiter. All gene IDs present in the foreground must be present in the background.

![](../img/doc/topAnat/topAnat_backgroundIDsHuman.png#tutoimgborder)

## Advanced Options

There are 2 types of advanced options. The first is related to the filtering of expression data used to run the enrichment test and the second is to tune the parameters of the enrichment algorithm itself.

### Filtering of expression data

By default, all developmental and life stages are considered for the enrichment analysis.

![](../img/doc/topAnat/topAnat_stagesSelection.webp#tutoimgborder)

It is possible to remove a development stage by clicking on **_Custom stages_** and then unchecking the development stage(s) you are not interested in between _embryo_ and _post-embryonic_ stages.

![](../img/doc/topAnat/topAnat_customStages.webp#tutoimgborder)

For each expression call, Bgee assigns a level of confidence to the call: silver or gold. The **_Data quality_** option allows to specify whether the analysis should be based on data of any quality level (default) or data of high quality (Gold level) only. To limit to only high-quality calls, click on the **_Gold confidence_** button.

![](../img/doc/topAnat/topAnat_dataQuality.webp#tutoimgborder)

### Algorithm parameters

![](../img/doc/topAnat/topAnat_algorithmParameters.webp#tutoimgborder)

#### Decorrelation type

Decorrelation is an algorithm used to take into account the topology of the anatomical ontology, to decrease the number of false positives and highly general terms in the results, owing to the inheritance problem. A precise description of these algorithms can be found in the [topGO documentation](https://bioconductor.org/packages/release/bioc/vignettes/topGO/inst/doc/topGO.pdf). Please note that using these decorrelation methods greatly increases the analysis time. By default, a Fisher test without any decorrelation is performed.

#### node size

This parameter allows pruning of the anatomical ontology from the terms that have a number of genes with data lower than this cutoff.

#### number of nodes

The number of significant nodes to be displayed in the generated graph of results. The parameter has a visualization purpose only and has no impact on the results of the analysis.

#### FDR threshold

Anatomical terms with an FDR higher than this threshold will not be considered as significant.

#### p-value threshold

Anatomical terms with a p-value higher than this threshold will not be considered as significant.

## Examples

- [Human genes involved in autism and epilepsy, with decorrelation.](/analysis/top-anat/8af5b0727ba1c62318707bf6f59c7c9c2b3697a1)
- [Mouse genes mapped to the GO term "spermatogenesis", with decorrelation.](/analysis/top-anat/2dd226ea83f1b041cf105e7d18a01d81fff19d10)
- [Zebrafish 3R ohnologs showing nervous system expression of 3R duplicates.](/analysis/top-anat/2bf58d4561f36bbaec9bebc730131423e695df3d)
- [Pigmentation genes in rabbit, with decorrelation.](/analysis/top-anat/9a9896727557dab83c45731d3fd4f4ccadf19be0)
- [COVID-19 related human genes, with decorrelation and increased FDR threshold.](/analysis/top-anat/10fb20cc0f767484a570ee82e5c24fc317657d23)
