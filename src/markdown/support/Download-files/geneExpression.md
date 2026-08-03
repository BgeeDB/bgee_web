# Expression Calls File

This documentation describes the content of the presence/absence expression calls download files, how values of each column are generated, and how to download expression calls data.

- [Introduction](#introduction 'Quick jump to this section')
- [Generation of Expression Calls](#generation-of-expression-calls 'Quick jump to this section')
- [Download Expression Calls](#download-expression-calls 'Quick jump to this section')
- [Choosing a Download File](#choosing-a-download-file 'Quick jump to this section')
  - [Condition Parameters](#condition-parameters 'Quick jump to this section')
  - [Simple File vs. Advanced File](#simple-file-vs-advanced-file 'Quick jump to this section')
- [Download File Details](#download-file-details 'Quick jump to this section')
  - [File Content](#file-content 'Quick jump to this section')
  - [Column Descriptions](#column-descriptions 'Quick jump to this section')

## Introduction

Bgee provides presence/absence of expression calls that can be retrieved in download files or by using our R package "BgeeDB". The expression calls are reported either: 1) by gene and anatomical entity or 2) by gene and i) anatomical entity, ii) developmental and life stage, iii) sex, and iv) strain/ethnicity.

Only wild-type healthy gene expression data is included in Bgee (i.e. no treatment, no disease, no gene knock-out, etc.). Bgee collects data from different experiments and data types, and provides a summary from all these data as unique calls of presence and absence of expression, per gene and condition. For each call, an FDR-corrected p-value and expression score are provided, which allows you to compare levels of expression.

Present/absent expression calls are very similar to the data that can be reported using _in situ_ hybridization methods; Bgee applies dedicated statistical analyses to generate such calls from EST, Affymetrix, bulk RNA-Seq, and single-cell RNA-Seq, and also collects _in situ_ hybridization calls from model organism databases. This offers the possibility to aggregate and compare these present/absent expression calls between different experiments, different data types, and different species.

## Generation of expression calls

### First step: computation of expression p-values per gene and sample

For each gene and each sample in Bgee, we produce a p-value based on a null hypothesis of expression level equal to or below the background expression noise (i.e. absence of expression).

- **bulk RNA-Seq data**: we use our own method to estimate for each RNA-Seq library independently the TPM threshold to consider a gene as actively transcribed, inferred by the amount of reads mapped to intergenic regions of the genome. For this, we first define a stringent set of reference intergenic regions based on available bulk RNA-Seq libraries for each species. We then call genes expressed if their level of expression is significantly higher than the background noise. For each gene in the library, we compute a Z-score in terms of standard deviations from the mean of reference intergenic regions. Then we calculate a p-value based on a null hypothesis of expression at a similar level to reference intergenic, estimated as a Normal distribution.
- **single-cell RNA-Seq data**: the method used is the same as for bulk RNA-Seq data for each cell/library.
- **Affymetrix data**: when raw CEL files are available, we use the gcRMA algorithm to normalize the signal taking into account probe sequences, and use a subset of weakly expressed probesets for estimating the background signal of expression. We then apply a Wilcoxon test to compare the normalized signal of the probesets with the background signal, as implemented in the 'mas5calls' function of the Bioconductor package 'affy', and we use the resulting p-value. When only the MAS5 files are available for an analysis, we use the flags provided by the MAS5 software with the following mapping to a p-value: 0.01 for 'present' detection flags, 0.05 for 'marginal' detection flags, 0.1 for 'absent' detection flags.
- **EST data**: based on the number of ESTs mapped to a gene in a library, we produce a p-value based on the null hypothesis that the EST count is not different from 0, with the formula: 2^(-(est_count + 1)).
- **_in situ_ hybridization data**: we retrieve _in situ_ hybridization data from Model Organism Databases part of the Alliance of Genome Resources. We map call qualities provided by these resources to p-values: 0.0004 for 'present high quality' calls; 0.01 for "present low quality"; 0.1 for "absent low quality"; 0.5 for "absent high quality".

### Second step: FDR corrected p-values per gene and condition

We capture information about the anatomical localization of samples, their developmental and life stage, sex, and strain or ethnicity. We either manually capture this information using ontologies and controlled vocabularies, or we map existing annotations provided by MODs to these ontologies and vocabularies.

After p-values are generated from the curated data for each gene and sample, they are propagated using anatomical and life stage ontologies. For instance, the p-value obtained for a gene in a sample studying the condition 'midbrain' at 'aged stage', will be propagated to the condition 'brain' at 'adult stage'. All p-values are propagated in a similar way toward the root of the graph of conditions.

After all p-values have been propagated, we apply a Benjamini-Hochberg FDR correction to generate one FDR p-value per gene and condition.

### Final step: generation of present/absent expression calls per gene and condition

- **Present gold quality** expression calls: when the FDR-corrected p-value for a gene in a condition is less than or equal to 0.01.
- **Present silver quality** expression calls: when the FDR-corrected p-value for a gene in a condition is less than or equal to 0.05, and greater than 0.01.
- **Absent gold quality** expression calls:
  - when the call is supported by at least one p-values generated from data types trusted for absent calls (bulk RNA-Seq, Affymetrix, _in situ_ hybridization)
  - and the FDR-corrected p-value for a gene in a condition is greater than 0.1, taking into account all requested data types
  - and the FDR-corrected p-value taking into account only data types trusted for absent calls is greater than 0.1
  - and there is no FDR-corrected p-value less than or equal to 0.05 in any child condition for that gene, considering the data types trusted for absent calls.
- **Absent silver quality** expression calls: same as absent gold quality expression calls, but using an FDR-corrected p-value threshold of 0.05.

## Download expression calls

The files can be found on the Bgee [download page](/download/gene-expression-calls) for each species. To access the download page from the Bgee homepage, go to the download section on the top toolbar and click on "Gene expression calls".

Once on the download calls webpage, you can either search for a specific species in the top search bar or look through the species list at the bottom and click on the species logo to access the different download file options. These datasets can also be downloaded directly using our R package "BgeeDB”.

![](../img/doc/Download-files/Expression-call-download.webp#tutoimgborder)

### Potential download problems

- If you open a file with a spreadsheet editor, it will potentially transform some cell values into dates. Files need to be **imported** into a spreadsheet editor to avoid such problems.
- Download files are compressed with gzip. They have to be **uncompressed** before opening them into an editor.
- Tarball containing TPM values for a species contain gzip files that also need to be uncompressed before opening with an editor.

## Choosing a download file

Once a species is selected, you will need to choose if you want data only for anatomical entities or for all conditions, and if you want the summarized information (simple file) or all information (advanced file). The implications of each option are explained in further detail below.

![](../img/doc/Download-files/Expression-call-download-per-species.webp#tutoimgborder)

### Condition parameters

There are two different options for `condition parameters`:

- anatomical entities only: files contain one expression call for each unique pair of genes and anatomical entities.
- all conditions parameters: files contain one expression call for each unique gene, anatomical entity, developmental stage, sex and strain.

### Simple file vs. Advanced file

There are two different options when downloading the file:

- simple: aimed at providing summarized information over all data types.
- advanced: aimed at reporting all information, for instance allowing you to retrieve the contribution of each data type to a call.

Simple and advanced files contain the same expression calls (same number of lines) but advanced files contain more information on each call (more columns).

Advanced file additional information:

- expression status generated from each data type are provided (present, absent, no data).
- number of present high quality and present low quality calls from each data type.
- number of absent high quality and absent low quality calls from _in situ_, Affymetrix, and RNA-Seq.
- data type for which calls are observed. Each call is observed in at least one data type.

## Download file details

Below is a complete description of which data you can expect to find in each download file and a detailed description of each column.

### File content

| Column | Content                                                                                                                                                                                                                                               | In anatomical simple files | In anatomical advanced files | In all conditions simple files | In all conditions advanced files | Example                        |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------- | ------------------------------ | -------------------------------- | ------------------------------ |
| 1      | [Gene ID](#gene-id-column-1 'See Gene ID column description')                                                                                                                                                                                         | Yes                        | Yes                          | Yes                            | Yes                              | FBgn0005427                    |
| 2      | [Gene name](#gene-name-column-2 'See Gene name column description')                                                                                                                                                                                   | Yes                        | Yes                          | Yes                            | Yes                              | ewg                            |
| 3      | [Anatomical entity ID](#anatomical-entity-id-column-3 'See Anatomical entity ID column description')                                                                                                                                                  | Yes                        | Yes                          | Yes                            | Yes                              | UBERON:6001060                 |
| 4      | [Anatomical entity name](#anatomical-entity-name-column-4 'See Anatomical entity name column description')                                                                                                                                            | Yes                        | Yes                          | Yes                            | Yes                              | embryonic brain                |
| 5      | [Developmental stage ID](#developmental-stage-id-column-5 'See Developmental stage ID column description')                                                                                                                                            | No                         | No                           | Yes                            | Yes                              | FBdv:00005334                  |
| 6      | [Developmental stage name](#developmental-stage-name-column-6 'See Developmental stage name column description')                                                                                                                                      | No                         | No                           | Yes                            | Yes                              | embryonic stage 16 (fruit fly) |
| 7      | [Sex](#sex-column-7 'See Sex column description')                                                                                                                                                                                                     | No                         | No                           | Yes                            | Yes                              | any                            |
| 8      | [Strain](#strain-column-8 'See Strain column description')                                                                                                                                                                                            | No                         | No                           | Yes                            | Yes                              | wild-type                      |
| 9      | [Expression](#expression-column-9 'See Expression column description')                                                                                                                                                                                | Yes                        | Yes                          | Yes                            | Yes                              | present                        |
| 10     | [Call quality](#call-quality-column-10 'See Call quality column description')                                                                                                                                                                         | Yes                        | Yes                          | Yes                            | Yes                              | gold quality                   |
| 11     | [FDR](#fdr-column-11 'See FDR column description')                                                                                                                                                                                                    | Yes                        | Yes                          | Yes                            | Yes                              | 0.0004                         |
| 12     | [Expression score](#expression-score-column-12 'See Expression score column description')                                                                                                                                                             | Yes                        | Yes                          | Yes                            | Yes                              | 49.99                          |
| 13     | [Expression rank](#expression-rank-column-13 'See Expression rank column description')                                                                                                                                                                | Yes                        | Yes                          | Yes                            | Yes                              | 8.32e3                         |
| 14     | [Including observed data](#including-observed-data-column-14 'See Including observed data column description')                                                                                                                                        | No                         | Yes                          | No                             | Yes                              | yes                            |
| 15     | [Self observation count](#self-observation-count-column-15 'See Self observation count column description')                                                                                                                                           | No                         | Yes                          | No                             | Yes                              | 1                              |
| 16     | [Descendant observation count](#descendant-observation-count-column-16 'See Descendant observation count column description')                                                                                                                         | No                         | Yes                          | No                             | Yes                              | 0                              |
| 17     | [Affymetrix expression](#affymetrix-expression-column-17 'See Affymetrix expression column description')                                                                                                                                              | No                         | Yes                          | No                             | Yes                              | no data                        |
| 18     | [Affymetrix call quality](#affymetrix-call-quality-column-18 'See Affymetrix call quality column description')                                                                                                                                        | No                         | Yes                          | No                             | Yes                              | NA                             |
| 19     | [Affymetrix FDR](#affymetrix-fdr-column-19 'See Affymetrix FDR column description')                                                                                                                                                                   | No                         | Yes                          | No                             | Yes                              | NA                             |
| 20     | [Affymetrix expression score](#affymetrix-expression-score-column-20 'See Affymetrix expression score column description')                                                                                                                            | No                         | Yes                          | No                             | Yes                              | NA                             |
| 21     | [Affymetrix expression rank](#affymetrix-expression-rank-column-21 'See Affymetrix expression rank column description')                                                                                                                               | No                         | Yes                          | No                             | Yes                              | NA                             |
| 22     | [Affymetrix weight for expression rank and score](#affymetrix-weight-for-expression-rank-and-score-column-22 'See Affymetrix weight for expression rank and score column description')                                                                | No                         | Yes                          | No                             | Yes                              | NA                             |
| 23     | [Including Affymetrix observed data](#including-affymetrix-observed-data-column-23 'See Including Affymetrix observed data column description')                                                                                                       | No                         | Yes                          | No                             | Yes                              | no                             |
| 24     | [Self observation count Affymetrix](#self-observation-count-affymetrix-column-24 'See Self observation count Affymetrix column description')                                                                                                          | No                         | Yes                          | No                             | Yes                              | 0                              |
| 25     | [Descendant observation count Affymetrix](#descendant-observation-count-affymetrix-column-25 'See Descendant observation count Affymetrix column description')                                                                                        | No                         | Yes                          | No                             | Yes                              | 0                              |
| 26     | [EST expression](#est-expression-column-26 'See EST expression column description')                                                                                                                                                                   | No                         | Yes                          | No                             | Yes                              | no data                        |
| 27     | [EST call quality](#est-call-quality-column-27 'See EST call quality column description')                                                                                                                                                             | No                         | Yes                          | No                             | Yes                              | NA                             |
| 28     | [EST FDR](#est-fdr-column-28 'See EST FDR column description')                                                                                                                                                                                        | No                         | Yes                          | No                             | Yes                              | NA                             |
| 29     | [EST expression score](#est-expression-score-column-29 'See EST expression score column description')                                                                                                                                                 | No                         | Yes                          | No                             | Yes                              | NA                             |
| 30     | [EST expression rank](#est-expression-rank-column-30 'See EST expression rank column description')                                                                                                                                                    | No                         | Yes                          | No                             | Yes                              | NA                             |
| 31     | [EST weight for expression rank and score](#est-weight-for-expression-rank-and-score-column-31 'See EST weight for expression rank and score column description')                                                                                     | No                         | Yes                          | No                             | Yes                              | NA                             |
| 32     | [Including EST observed data](#including-est-observed-data-column-32 'See Including EST observed data column description')                                                                                                                            | No                         | Yes                          | No                             | Yes                              | no                             |
| 33     | [Self observation count EST](#self-observation-count-est-column-33 'See Self observation count EST column description')                                                                                                                               | No                         | Yes                          | No                             | Yes                              | 0                              |
| 34     | [Descendant observation count EST](#descendant-observation-count-est-column-34 'See Descendant observation count EST column description')                                                                                                             | No                         | Yes                          | No                             | Yes                              | 0                              |
| 35     | [in situ hybridization expression](#in-situ-hybridization-expression-column-35 'See in situ hybridization expression column description')                                                                                                             | No                         | Yes                          | No                             | Yes                              | present                        |
| 36     | [in situ hybridization call quality](#in-situ-hybridization-call-quality-column-36 'See in situ hybridization call quality column description')                                                                                                       | No                         | Yes                          | No                             | Yes                              | gold quality                   |
| 37     | [in situ hybridization FDR](#in-situ-hybridization-fdr-column-37 'See in situ hybridization FDR column description')                                                                                                                                  | No                         | Yes                          | No                             | Yes                              | 0.0004                         |
| 38     | [in situ hybridization expression score](#in-situ-hybridization-expression-score-column-38 'See in situ hybridization expression score column description')                                                                                           | No                         | Yes                          | No                             | Yes                              | 49.99                          |
| 39     | [in situ hybridization expression rank](#in-situ-hybridization-expression-rank-column-39 'See in situ hybridization expression rank column description')                                                                                              | No                         | Yes                          | No                             | Yes                              | 8.32e3                         |
| 40     | [in situ hybridization weight for expression rank and score](#in-situ-hybridization-weight-for-expression-rank-and-score-column-40 'See in situ hybridization weight for expression rank and score column description')                               | No                         | Yes                          | No                             | Yes                              | 5.00                           |
| 41     | [Including in situ hybridization observed data](#including-in-situ-hybridization-observed-data-column-41 'See Including in situ hybridization observed data column description')                                                                      | No                         | Yes                          | No                             | Yes                              | yes                            |
| 42     | [Self observation count in situ hybridization](#self-observation-count-in-situ-hybridization-column-42 'See Self observation count in situ hybridization column description')                                                                         | No                         | Yes                          | No                             | Yes                              | 1                              |
| 43     | [Descendant observation count in situ hybridization](#descendant-observation-count-in-situ-hybridization-column-43 'See Descendant observation count in situ hybridization column description')                                                       | No                         | Yes                          | No                             | Yes                              | 0                              |
| 44     | [RNA-Seq expression](#rna-seq-expression-column-44 'See RNA-Seq expression column description')                                                                                                                                                       | No                         | Yes                          | No                             | Yes                              | no data                        |
| 45     | [RNA-Seq call quality](#rna-seq-call-quality-column-45 'See RNA-Seq call quality column description')                                                                                                                                                 | No                         | Yes                          | No                             | Yes                              | NA                             |
| 46     | [RNA-Seq FDR](#rna-seq-fdr-column-46 'See RNA-Seq FDR column description')                                                                                                                                                                            | No                         | Yes                          | No                             | Yes                              | NA                             |
| 47     | [RNA-Seq expression score](#rna-seq-expression-score-column-47 'See RNA-Seq expression score column description')                                                                                                                                     | No                         | Yes                          | No                             | Yes                              | NA                             |
| 48     | [RNA-Seq expression rank](#rna-seq-expression-rank-column-48 'See RNA-Seq expression rank column description')                                                                                                                                        | No                         | Yes                          | No                             | Yes                              | NA                             |
| 49     | [RNA-Seq weight for expression rank and score](#rna-seq-weight-for-expression-rank-and-score-column-49 'See RNA-Seq weight for expression rank and score column description')                                                                         | No                         | Yes                          | No                             | Yes                              | NA                             |
| 50     | [Including RNA-Seq observed data](#including-rna-seq-observed-data-column-50 'See Including RNA-Seq observed data column description')                                                                                                                | No                         | Yes                          | No                             | Yes                              | no                             |
| 51     | [Self observation count RNA-Seq](#self-observation-count-rna-seq-column-51 'See Self observation count RNA-Seq column description')                                                                                                                   | No                         | Yes                          | No                             | Yes                              | 0                              |
| 52     | [Descendant observation count RNA-Seq](#descendant-observation-count-rna-seq-column-52 'See Descendant observation count RNA-Seq column description')                                                                                                 | No                         | Yes                          | No                             | Yes                              | 0                              |
| 53     | [full-length single-cell RNA-Seq expression](#full-length-single-cell-rna-seq-expression-column-53 'See full-length single-cell RNA-Seq expression column description')                                                                               | No                         | Yes                          | No                             | Yes                              | no data                        |
| 54     | [full-length single-cell RNA-Seq call quality](#full-length-single-cell-rna-seq-call-quality-column-54 'See full-length single-cell RNA-Seq call quality column description')                                                                         | No                         | Yes                          | No                             | Yes                              | NA                             |
| 55     | [full-length single-cell RNA-Seq FDR](#full-length-single-cell-rna-seq-fdr-column-55 'See full-length single-cell RNA-Seq FDR column description')                                                                                                    | No                         | Yes                          | No                             | Yes                              | NA                             |
| 56     | [full-length single-cell RNA-Seq expression score](#full-length-single-cell-rna-seq-expression-score-column-56 'See full-length single-cell RNA-Seq expression score column description')                                                             | No                         | Yes                          | No                             | Yes                              | NA                             |
| 57     | [full-length single-cell RNA-Seq expression rank](#full-length-single-cell-rna-seq-expression-rank-column-57 'See full-length single-cell RNA-Seq expression rank column description')                                                                | No                         | Yes                          | No                             | Yes                              | NA                             |
| 58     | [full-length single-cell RNA-Seq weight for expression rank and score](#full-length-single-cell-rna-seq-weight-for-expression-rank-and-score-column-58 'See full-length single-cell RNA-Seq weight for expression rank and score column description') | No                         | Yes                          | No                             | Yes                              | NA                             |
| 59     | [Including full-length single-cell RNA-Seq observed data](#including-full-length-single-cell-rna-seq-observed-data-column-59 'See Including full-length single-cell RNA-Seq observed data column description')                                        | No                         | Yes                          | No                             | Yes                              | no                             |
| 60     | [Self observation count full-length single-cell RNA-Seq](#self-observation-count-full-length-single-cell-rna-seq-column-60 'See Self observation count full-length single-cell RNA-Seq column description')                                           | No                         | Yes                          | No                             | Yes                              | 0                              |
| 61     | [Descendant observation count full-length single-cell RNA-Seq](#descendant-observation-count-full-length-single-cell-rna-seq-column-61 'See Descendant observation count full-length single-cell RNA-Seq column description')                         | No                         | Yes                          | No                             | Yes                              | 0                              |

### Column descriptions

##### <a name="gene-id-column-1"></a>Gene ID (column 1)

Unique identifier of the gene.

##### <a name="gene-name-column-2"></a>Gene name (column 2)

Name of the gene defined by `Gene ID` (column 1).

##### <a name="anatomical-entity-id-column-3"></a>Anatomical entity ID (column 3)

Unique identifier of the anatomical entity, from the Uberon ontology.

##### <a name="anatomical-entity-name-column-4"></a>Anatomical entity name (column 4)

Name of the anatomical entity defined by `Anatomical entity ID` (column 3).

##### <a name="developmental-stage-id-column-5"></a>Developmental stage ID (column 5)

Unique identifier of the developmental stage, from the Uberon ontology.

##### <a name="developmental-stage-name-column-6"></a>Developmental stage name (column 6)

Name of the developmental stage defined by `Developmental stage ID` (column 5).

##### <a name="sex-column-7"></a>Sex (column 7)

Sex of the sample used to generate the call.

##### <a name="strain-column-8"></a>Strain (column 8)

Strain of the sample used to generate the call.

##### <a name="expression-column-9"></a>Expression (column 9)

Call generated from all data types for the selected combination of condition parameters (anatomical or all conditions). Permitted values: present, absent.

##### <a name="call-quality-column-10"></a>Call quality (column 10)

Call quality from all data types for the selected combination of condition parameters (anatomical or all conditions). Permitted values: gold quality, silver quality.

##### <a name="fdr-column-11"></a>FDR (column 11)

FDR-corrected p-value of the call.

##### <a name="expression-score-column-12"></a>Expression score (column 12)

Score of expression to the call. The score uses the minimum and maximum `Expression Rank` (column 13) of the species to normalize the expression to a value between 0 and 100.

Low score means that the gene is lowly expressed in the condition.

##### <a name="expression-rank-column-13"></a>Expression rank (column 13)

Rank score associated with the call. Rank scores of expression calls are normalized across genes, conditions and species.

A low score means that the gene is highly expressed in the condition.

##### <a name="including-observed-data-column-14"></a>Including observed data (column 14)

Permitted value: `yes`.

Only calls that were actually seen in experimental data, at least once, are in this file.

##### <a name="self-observation-count-column-15"></a>Self observation count (column 15)

Number of observations coming from experimental data for this combination of condition parameters (anatomical or all conditions).

##### <a name="descendant-observation-count-column-16"></a>Descendant observation count (column 16)

Number of observations coming from experimental data for the combination of condition parameters (anatomical or all conditions) descendant of the current one.

##### <a name="affymetrix-expression-column-17"></a>Affymetrix expression (column 17)

Call generated from Affymetrix data for the selected combination of condition parameters (anatomical or all conditions). Permitted values: present, absent, no data.

##### <a name="affymetrix-call-quality-column-18"></a>Affymetrix call quality (column 18)

Quality associated with the call from Affymetrix data. Permitted values: gold quality, silver quality, NA.

##### <a name="affymetrix-fdr-column-19"></a>Affymetrix FDR (column 19)

FDR-corrected p-value of the call calculated using p-values coming from Affymetrix data.

##### <a name="affymetrix-expression-score-column-20"></a>Affymetrix expression score (column 20)

Score of expression to the call from Affymetrix data. The score uses the minimum and maximum `Expression Rank` (column 13) of the species to normalize the expression to a value between 0 and 100.

Low score means that the gene is lowly expressed in the condition.

##### <a name="affymetrix-expression-rank-column-21"></a>Affymetrix expression rank (column 21)

Rank score associated with the call from Affymetrix data. Rank scores of expression calls are normalized across genes, conditions and species.

A low score means that the gene is highly expressed in the condition.

##### <a name="affymetrix-weight-for-expression-rank-and-score-column-22"></a>Affymetrix weight for expression rank and score (column 22)

The weight given to Affymetrix expression ranks and scores when computing the weighted mean over several data types.

##### <a name="including-affymetrix-observed-data-column-23"></a>Including Affymetrix observed data (column 23)

Information about the calls actually coming from experimental Affymetrix data for this combination of condition parameters (anatomical or all conditions).

Permitted value: `yes` or `no`.

##### <a name="self-observation-count-affymetrix-column-24"></a>Self observation count Affymetrix (column 24)

Number of observations coming from experimental Affymetrix data for this combination of condition parameters (anatomical or all conditions).

##### <a name="descendant-observation-count-affymetrix-column-25"></a>Descendant observation count Affymetrix (column 25)

Number of observations coming from experimental Affymetrix data for the combination of condition parameters (anatomical or all conditions) descendant of the current one.

##### <a name="est-expression-column-26"></a>EST expression (column 26)

Call generated from EST data for the selected combination of condition parameters (anatomical or all conditions). Permitted values: present, absent, no data.

##### <a name="est-call-quality-column-27"></a>EST call quality (column 27)

Quality associated with the call from EST data. Permitted values: gold quality, silver quality, NA.

##### <a name="est-fdr-column-28"></a>EST FDR (column 28)

FDR-corrected p-value of the call calculated using p-values coming from EST data.

##### <a name="est-expression-score-column-29"></a>EST expression score (column 29)

Score of expression to the call from EST data. The score uses the minimum and maximum `Expression Rank` (column 13) of the species to normalize the expression to a value between 0 and 100.

Low score means that the gene is lowly expressed in the condition.

##### <a name="est-expression-rank-column-30"></a>EST expression rank (column 30)

Rank score associated with the call from EST data. Rank scores of expression calls are normalized across genes, conditions, and species.

A low score means that the gene is highly expressed in the condition.

##### <a name="est-weight-for-expression-rank-and-score-column-31"></a>EST weight for expression rank and score (column 31)

The weight given to EST expression ranks and scores when computing the weighted mean over several data types.

##### <a name="including-est-observed-data-column-32"></a>Including EST observed data (column 32)

Information about the calls actually coming from experimental EST data for this combination of condition parameters (anatomical or all conditions).

Permitted value: `yes` or `no`.

##### <a name="self-observation-count-est-column-33"></a>Self observation count EST (column 33)

Number of observations coming from experimental EST data for this combination of condition parameters (anatomical or all conditions).

##### <a name="descendant-observation-count-est-column-34"></a>Descendant observation count EST (column 34)

Number of observations coming from experimental EST data for the combination of condition parameters (anatomical or all conditions) descendant of the current one.

##### <a name="in-situ-hybridization-expression-column-35"></a>in situ hybridization expression (column 35)

Call generated from _in situ_ hybridization data for the selected combination of condition parameters (anatomical or all conditions). Permitted values: present, absent, no data.

##### <a name="in-situ-hybridization-call-quality-column-36"></a>in situ hybridization call quality (column 36)

Quality associated with the call from in situ hybridization data. Permitted values: gold quality, silver quality, NA.

##### <a name="in-situ-hybridization-fdr-column-37"></a>in situ hybridization FDR (column 37)

FDR value of the call calculated using p-values coming from in situ hybridization data.

##### <a name="in-situ-hybridization-expression-score-column-38"></a>in situ hybridization expression score (column 38)

Score of expression to the call from in situ hybridization data. The score uses the minimum and maximum `Expression Rank` (column 13) of the species to normalize the expression to a value between 0 and 100.

Low score means that the gene is lowly expressed in the condition.

##### <a name="in-situ-hybridization-expression-rank-column-39"></a>in situ hybridization expression rank (column 39)

Rank score associated with the call from in situ hybridization data. Rank scores of expression calls are normalized across genes, conditions, and species.

A low score means that the gene is highly expressed in the condition.

##### <a name="in-situ-hybridization-weight-for-expression-rank-and-score-column-40"></a>in situ hybridization weight for expression rank and score (column 40)

The weight given to in situ hybridization expression ranks and scores when computing the weighted mean over several data types.

##### <a name="including-in-situ-hybridization-observed-data-column-41"></a>Including in situ hybridization observed data (column 41)

Information about the calls actually coming from experimental in situ hybridization data for this combination of condition parameters (anatomical or all conditions).

Permitted value: `yes` or `no`.

##### <a name="self-observation-count-in-situ-hybridization-column-42"></a>Self observation count in situ hybridization (column 42)

Number of observations coming from experimental in situ hybridization data for this combination of condition parameters (anatomical or all conditions).

##### <a name="descendant-observation-count-in-situ-hybridization-column-43"></a>Descendant observation count in situ hybridization (column 43)

Number of observations coming from experimental in situ hybridization data for the combination of condition parameters (anatomical or all conditions) descendant of the current one.

##### <a name="rna-seq-expression-column-44"></a>RNA-Seq expression (column 44)

Call generated from bulk RNA-Seq data for the selected combination of condition parameters (anatomical or all conditions). Permitted values: present, absent, no data.

##### <a name="rna-seq-call-quality-column-45"></a>RNA-Seq call quality (column 45)

Quality associated with the call from bulk RNA-Seq data. Permitted values: gold quality, silver quality, NA.

##### <a name="rna-seq-fdr-column-46"></a>RNA-Seq FDR (column 46)

FDR-corrected p-value of the call calculated using p-values coming from RNA-Seq data.

##### <a name="rna-seq-expression-score-column-47"></a>RNA-Seq expression score (column 47)

Score of expression to the call from RNA-Seq data. The score uses the minimum and maximum `Expression Rank` (column 13) of the species to normalize the expression to a value between 0 and 100.

Low score means that the gene is lowly expressed in the condition.

##### <a name="rna-seq-expression-rank-column-48"></a>RNA-Seq expression rank (column 48)

Rank score associated with the call from RNA-Seq data. Rank scores of expression calls are normalized across genes, conditions and species.

A low score means that the gene is highly expressed in the condition.

##### <a name="rna-seq-weight-for-expression-rank-and-score-column-49"></a>RNA-Seq weight for expression rank and score (column 49)

The weight given to RNA-Seq expression ranks and scores when computing the weighted mean over several data types.

##### <a name="including-rna-seq-observed-data-column-50"></a>Including RNA-Seq observed data (column 50)

Information about the calls actually coming from experimental RNA-Seq data for this combination of condition parameters (anatomical or all conditions).

Permitted value: `yes` or `no`.

##### <a name="self-observation-count-rna-seq-column-51"></a>Self observation count RNA-Seq (column 51)

Number of observations coming from experimental RNA-Seq data for this combination of condition parameters (anatomical or all conditions).

##### <a name="descendant-observation-count-rna-seq-column-52"></a>Descendant observation count RNA-Seq (column 52)

Number of observations coming from experimental RNA-Seq data for the combination of condition parameters (anatomical or all conditions) descendant of the current one.

##### <a name="full-length-single-cell-rna-seq-expression-column-53"></a>full-length single-cell RNA-Seq expression (column 53)

Call generated from full-length single-cell RNA-Seq data for the selected combination of condition parameters (anatomical or all conditions). Permitted values: present, absent, no data.

##### <a name="full-length-single-cell-rna-seq-call-quality-column-54"></a>full-length single-cell RNA-Seq call quality (column 54)

Quality associated with the call from full-length single-cell RNA-Seq data. Permitted values: gold quality, silver quality, NA.

##### <a name="full-length-single-cell-rna-seq-fdr-column-55"></a>full-length single-cell RNA-Seq FDR (column 55)

FDR-corrected p-value of the call calculated using p-values coming from full-length single-cell RNA-Seq data.

##### <a name="full-length-single-cell-rna-seq-expression-score-column-56"></a>full-length single-cell RNA-Seq expression score (column 56)

Score of expression to the call from full-length single-cell RNA-Seq data. The score uses the minimum and maximum `Expression Rank` (column 13) of the species to normalize the expression to a value between 0 and 100.

Low score means that the gene is lowly expressed in the condition.

##### <a name="full-length-single-cell-rna-seq-expression-rank-column-57"></a>full-length single-cell RNA-Seq expression rank (column 57)

Rank score associated with the call from full-length single-cell RNA-Seq data. Rank scores of expression calls are normalized across genes, conditions, and species.

A low score means that the gene is highly expressed in the condition.

##### <a name="full-length-single-cell-rna-seq-weight-for-expression-rank-and-score-column-58"></a>full-length single-cell RNA-Seq weight for expression rank and score (column 58)

The weight given to full-length single-cell expression ranks and scores when computing the weighted mean over several data types.

##### <a name="including-full-length-single-cell-rna-seq-observed-data-column-59"></a>Including full-length single-cell RNA-Seq observed data (column 59)

Information about the calls actually coming from experimental full-length single-cell RNA-Seq data for this combination of condition parameters (anatomical or all conditions).

Permitted value: `yes` or `no`.

##### <a name="self-observation-count-full-length-single-cell-rna-seq-column-60"></a>Self observation count full-length single-cell RNA-Seq (column 60)

Number of observations coming from experimental full-length single-cell RNA-Seq data for this combination of condition parameters (anatomical or all conditions).

##### <a name="descendant-observation-count-full-length-single-cell-rna-seq-column-61"></a>Descendant observation count full-length single-cell RNA-Seq (column 61)

Number of observations coming from experimental full-length single-cell RNA-Seq data for the combination of condition parameters (anatomical or all conditions) descendant of the current one.
