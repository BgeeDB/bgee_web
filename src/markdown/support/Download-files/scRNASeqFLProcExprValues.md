# Full-Length scRNA-seq Processed Expression Values Files

This documentation describes the format of annotation download files (library and experiment files) as well as the processed expression values download files for single-cell RNA-Seq data. The files can be found on the Bgee [download page](/download/processed-expression-values).

- [Annotation (experiments/libraries) files](#annotation-experimentslibraries-files 'Quick jump to this section')
- [Processed expression (read counts, TPM, FPKM) files](#processed-expression-read-counts-tpm-fpkm-files 'Quick jump to this section')

## Annotation (experiments/libraries) files

The annotation download files are divided into 2 main files:

1. **[library file](#library-file 'Quick jump to this section')**: provides detailed information for each individual sample (where each sample is a unique cell), including anatomical entity, developmental stage, cell type, sex, strain, and quality scores used in quality control metrics.

2. **[experiment file](#experiment-file 'Quick jump to this section')**: provides overall information about the experiment, including the number of libraries that belong to the experiment, and the number of conditions, organs, stages, cell types, and strains.

### Library file

#### File format and column descriptions

| Column | Content                                                                                                                                                                    |                                                                           Example                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 1      | [Experiment ID](#experiment-id-column-1 'See Experiment ID column description')                                                                                            |                                                                          ERP013381                                                                           |
| 2      | [Library ID](#library-id-column-2 'See Library ID column description')                                                                                                     |                                                                          ERX1226594                                                                          |
| 3      | [Anatomical entity ID](#anatomical-entity-id-column-3 'See Anatomical entity ID column description')                                                                       |                                                                        UBERON:0000922                                                                        |
| 4      | [Anatomical entity name](#anatomical-entity-name-column-4 'See Anatomical entity name column description')                                                                 |                                                                            embryo                                                                            |
| 5      | [Stage ID](#stage-id-column-5 'See Stage ID column description')                                                                                                           |                                                                        MmusDv:0000014                                                                        |
| 6      | [Stage name](#stage-name-column-6 'See Stage name column description')                                                                                                     |                                                                   Theiler stage 09 (mouse)                                                                   |
| 7      | [Cell type ID](#cell-type-id-column-7 'See Cell type ID column description')                                                                                               |                                                                          CL:0000352                                                                          |
| 8      | [Cell type name](#cell-type-name-column-8 'See Cell type name column description')                                                                                         |                                                                        epiblast cell                                                                         |
| 9      | [Sex](#sex-column-9 'See Sex column description')                                                                                                                          |                                                                              NA                                                                              |
| 10     | [Strain](#strain-column-10 'See Strain column description')                                                                                                                |                                                                             CD-1                                                                             |
| 11     | [Expression mapped anatomical entity ID](#expression-mapped-anatomical-entity-id-column-11 'See Expression mapped anatomical entity ID column description')                |                                                                        UBERON:0000922                                                                        |
| 12     | [Expression mapped anatomical entity name](#expression-mapped-anatomical-entity-name-column-12 'See Expression mapped anatomical entity name column description')          |                                                                            embryo                                                                            |
| 13     | [Expression mapped stage ID](#expression-mapped-stage-id-column-13 'See Expression mapped stage ID column description')                                                    |                                                                        MmusDv:0000014                                                                        |
| 14     | [Expression mapped stage name](#expression-mapped-stage-name-column-14 'See Expression mapped stage name column description')                                              |                                                                   Theiler stage 09 (mouse)                                                                   |
| 15     | [Expression mapped cell type ID](#expression-mapped-cell-type-id-column-15 'See Expression mapped cell type ID column description')                                        |                                                                          CL:0000352                                                                          |
| 16     | [Expression mapped cell type name](#expression-mapped-cell-type-name-column-16 'See Expression mapped cell type name column description')                                  |                                                                        epiblast cell                                                                         |
| 17     | [Expression mapped sex](#expression-mapped-sex-column-17 'See Expression mapped sex column description')                                                                   |                                                                        not annotated                                                                         |
| 18     | [Expression mapped strain](#expression-mapped-strain-column-18 'See Expression mapped strain column description')                                                          |                                                                             CD-1                                                                             |
| 19     | [Platform ID](#platform-id-column-19 'See Platform ID column description')                                                                                                 |                                                                     Illumina HiSeq 2500                                                                      |
| 20     | [Library type](#library-type-column-20 'See Library type column description')                                                                                              |                                                                            single                                                                            |
| 21     | [Library orientation](#library-orientation-column-21 'See Library orientation column description')                                                                         |                                                                              NA                                                                              |
| 22     | [TPM expression threshold](#tpm-expression-threshold-column-22 'See TPM expression threshold column description')                                                          |                                                                           3.88442                                                                            |
| 23     | [Read count](#read-count-column-23 'See Read count column description')                                                                                                    |                                                                           3238518                                                                            |
| 24     | [Mapped read count](#mapped-read-count-column-24 'See Mapped read count column description')                                                                               |                                                                           1467281                                                                            |
| 25     | [Min. read length](#min-read-length-column-25 'See Min. read length column description')                                                                                   |                                                                             125                                                                              |
| 26     | [Max. read length](#max-read-length-column-26 'See Max. read length column description')                                                                                   |                                                                             125                                                                              |
| 27     | [All genes percent present](#all-genes-percent-present-column-27 'See All genes percent present column description')                                                       |                                                                            13.79                                                                             |
| 28     | [Protein coding genes percent present](#protein-coding-genes-percent-present-column-28 'See Protein coding genes percent present column description')                      |                                                                            31.54                                                                             |
| 29     | [Intergenic regions percent present](#intergenic-regions-percent-present-column-29 'See Intergenic regions percent present column description')                            |                                                                             1.55                                                                             |
| 30     | [Distinct rank count](#distinct-rank-count-column-30 'See Distinct rank count column description')                                                                         |                                                                            10642                                                                             |
| 31     | [Max rank in the expression mapped condition](#max-rank-in-the-expression-mapped-condition-column-31 'See Max rank in the expression mapped condition column description') |                                                                              NA                                                                              |
| 32     | [Run IDs](#run-ids-column-32 'See Run IDs column description')                                                                                                             |                                                                              NA                                                                              |
| 33     | [Data source](#data-source-column-33 'See Data source column description')                                                                                                 |                                                                             SRA                                                                              |
| 34     | [Data source URL](#data-source-url-column-34 'See Data source URL column description')                                                                                     |                                                      https://www.ncbi.nlm.nih.gov/sra/?term=ERX1226594                                                       |
| 35     | [Bgee normalized data URL](#bgee-normalized-data-url-column-35 'See Bgee normalized data URL column description')                                                          | https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/Mus_musculus/Mus_musculus_Full-Length_SC_RNA-Seq_read_counts_TPM_FPKM_ERP013381.tsv.gz |
| 36     | [Raw file URL](#raw-file-url-column-36 'See Raw file URL column description')                                                                                              |                                                 https://trace.ncbi.nlm.nih.gov/Traces/study/?acc=ERX1226594                                                  |

##### <a name="experiment-id-column-1"></a>Experiment ID (column 1)

The Experiment ID column provides the unique identifier per experiment.

##### <a name="library-id-column-2"></a>Library ID (column 2)

The Library ID column provides the unique identifier per sample (where each sample is a unique cell) that belongs to an `Experiment ID` (column 1).

##### <a name="anatomical-entity-id-column-3"></a>Anatomical entity ID (column 3)

The Anatomical entity ID column provides the unique identifier of the anatomical entity, from the Uberon ontology.

##### <a name="anatomical-entity-name-column-4"></a>Anatomical entity name (column 4)

The anatomical entity name column provides the name of the anatomical entity defined by `Anatomical entity ID` (column 3).

##### <a name="stage-id-column-5"></a>Stage ID (column 5)

The Stage ID column provides the unique identifier of the developmental stage, from the Uberon ontology.

##### <a name="stage-name-column-6"></a>Stage name (column 6)

The Stage name column provides the name of the developmental stage defined by `Stage ID` (column 5).

##### <a name="cell-type-id-column-7"></a>Cell type ID (column 7)

The Cell type ID column provides the unique identifier of the cell type, from the Uberon ontology.

##### <a name="cell-type-name-column-8"></a>Cell type name (column 8)

The Cell type name column provides the name of the cell type defined by `Cell type ID` (column 7).

##### <a name="sex-column-9"></a>Sex (column 9)

The Sex column provides the sex information ('not annotated', 'NA', 'mixed', 'male', 'female', 'hermaphrodite').

##### <a name="strain-column-10"></a>Strain (column 10)

The Strain column provides information about the genetic variant or subtype of an organism.

##### <a name="expression-mapped-anatomical-entity-id-column-11"></a>Expression mapped anatomical entity ID (column 11)

The Expression mapped anatomical entity ID column is the annotation used in the Bgee expression calls. It can be different from the `Anatomical entity ID` (column 3) if it is too granular to be inserted in the database.

##### <a name="expression-mapped-anatomical-entity-name-column-12"></a>Expression mapped anatomical entity name (column 12)

The Expression mapped anatomical entity name column provides the name of the anatomical entity defined by `Expression mapped anatomical entity ID` (column 11).

##### <a name="expression-mapped-stage-id-column-13"></a>Expression mapped stage ID (column 13)

The Expression mapped stage ID column is the annotation used in the Bgee expression calls. It can be different from the `Stage ID` (column 5) if it is too granular to be inserted in the database.

##### <a name="expression-mapped-stage-name-column-14"></a>Expression mapped stage name (column 14)

The Expression mapped stage name column provides the name of the developmental stage defined by `Expression mapped stage ID` (column 13).

##### <a name="expression-mapped-cell-type-id-column-15"></a>Expression mapped cell type ID (column 15)

The Expression mapped cell type ID column is the annotation used in the Bgee expression calls. It can be different from the `Cell type ID` (column 7) if it is too granular to be inserted in the database.

##### <a name="expression-mapped-cell-type-name-column-16"></a>Expression mapped cell type name (column 16)

The Expression mapped cell type name column provides the name of the cell type defined by `Expression mapped cell type ID` (column 15).

##### <a name="expression-mapped-sex-column-17"></a>Expression mapped sex (column 17)

The Expression mapped sex column provides the sex information used in the Bgee expression calls ('any', 'male', 'female', 'hermaphrodite').

##### <a name="expression-mapped-strain-column-18"></a>Expression mapped strain (column 18)

The Expression mapped strain column provides the genetic variant or subtype of an organism used in the Bgee expression calls.

##### <a name="platform-id-column-19"></a>Platform ID (column 19)

The Platform ID column provides the sequencing platform identifier.

##### <a name="library-type-column-20"></a>Library type (column 20)

The Library type column consists of the strandedness of the library. This can be single or paired-end.

##### <a name="library-orientation-column-21"></a>Library orientation (column 21)

The Library orientation column provides the relative orientation of the reads.

##### <a name="tpm-expression-threshold-column-22"></a>TPM expression threshold (column 22)

The TPM expression threshold column provides the minimum TPM value to call expressed genes in the `Library ID` (column 2).

##### <a name="read-count-column-23"></a>Read count (column 23)

The Read count column provides the total number of read counts that will be mapped to the transcriptome.

##### <a name="mapped-read-count-column-24"></a>Mapped read count (column 24)

The Mapped read count column provides the number of read counts that overlap/map to the genomic position.

##### <a name="min-read-length-column-25"></a>Min. read length (column 25)

The Min. read length column provides the minimum number of base pairs (bp) sequenced from a DNA fragment.

##### <a name="max-read-length-column-26"></a>Max. read length (column 26)

The Max. read length column provides the maximum number of base pairs (bp) sequenced from a DNA fragment.

##### <a name="all-genes-percent-present-column-27"></a>All genes percent present (column 27)

The All genes percent present column provides information about the proportion of genes called actively expressed in the `Library ID` (column 2).

##### <a name="protein-coding-genes-percent-present-column-28"></a>Protein coding genes percent present (column 28)

The Protein coding genes percent present column provides information about the proportion of protein coding genes called actively expressed in the `Library ID` (column 2).

##### <a name="intergenic-regions-percent-present-column-29"></a>Intergenic regions percent present (column 29)

The Intergenic regions percent present column provides information about the proportion of intergenic regions called actively expressed in the `Library ID` (column 2).

##### <a name="distinct-rank-count-column-30"></a>Distinct rank count (column 30)

The Distinct rank count column provides information about unique rank counts in the `Library ID` (column 2). It is used to weigh the rank information coming from this library when computing expression ranks and expression scores.

##### <a name="max-rank-in-the-expression-mapped-condition-column-31"></a>Max rank in the expression mapped condition (column 31)

The Max rank in the expression mapped condition column provides the max rank over all libraries in this condition. It is used to normalize ranks between conditions when computing expression ranks and expression scores.

##### <a name="run-ids-column-32"></a>Run IDs (column 32)

The Run IDs column refers to a sequencing run associated with the `library ID` (column 2).

##### <a name="data-source-column-33"></a>Data source (column 33)

Data repository from where the raw files were extracted. Collect all `Run IDs` (column 32) corresponding to a target `library ID` (column 2).

##### <a name="data-source-url-column-34"></a>Data source URL (column 34)

URL pathway to the data repository where is located the `library ID` (column 2).

##### <a name="bgee-normalized-data-url-column-35"></a>Bgee normalized data URL (column 35)

URL pathway where is located the processed data for the correspondent `Experiment ID` (column 1) in Bgee.

##### <a name="raw-file-url-column-36"></a>Raw file URL (column 36)

URL pathway to the SRA Run Selector. This allows access to the `Run IDs` (column 32) through the `library ID` (column 2).

#### Example rows

| Experiment ID | Library ID | Anatomical entity ID | Anatomical entity name | Stage ID       | Stage name               | Cell type ID | Cell type name | Sex | Strain | Expression mapped anatomical entity ID | Expression mapped anatomical entity name | Expression mapped stage ID | Expression mapped stage name | Expression mapped cell type ID | Expression mapped cell type name | Expression mapped sex | Expression mapped strain | Platform ID         | Library type | Library orientation | TPM expression threshold | Read count | Mapped read count | Min. read length | Max. read length | All genes percent present | Protein coding genes percent present | Intergenic regions percent present | Distinct rank count | Max rank in the expression mapped condition | Run IDs | Data source | Data source URL                                   | Bgee normalized data URL                                                                                                                                     | Raw file URL                                                |
| ------------- | ---------- | -------------------- | ---------------------- | -------------- | ------------------------ | ------------ | -------------- | --- | ------ | -------------------------------------- | ---------------------------------------- | -------------------------- | ---------------------------- | ------------------------------ | -------------------------------- | --------------------- | ------------------------ | ------------------- | ------------ | ------------------- | ------------------------ | ---------- | ----------------- | ---------------- | ---------------- | ------------------------- | ------------------------------------ | ---------------------------------- | ------------------- | ------------------------------------------- | ------- | ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| ERP013381     | ERX1226594 | UBERON:0000922       | embryo                 | MmusDv:0000014 | Theiler stage 09 (mouse) | CL:0000352   | epiblast cell  | NA  | CD-1   | UBERON:0000922                         | embryo                                   | MmusDv:0000014             | Theiler stage 09 (mouse)     | CL:0000352                     | epiblast cell                    | not annotated         | CD-1                     | Illumina HiSeq 2500 | single       | NA                  | 3.88442                  | 3238518    | 1467281           | 125              | 125              | 13.79                     | 31.54                                | 1.55                               | 10642               | NA                                          | NA      | SRA         | https://www.ncbi.nlm.nih.gov/sra/?term=ERX1226594 | https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/Mus_musculus/Mus_musculus_Full-Length_SC_RNA-Seq_read_counts_TPM_FPKM_ERP013381.tsv.gz | https://trace.ncbi.nlm.nih.gov/Traces/study/?acc=ERX1226594 |
| ERP013381     | ERX1226595 | UBERON:0000922       | embryo                 | MmusDv:0000014 | Theiler stage 09 (mouse) | CL:0000352   | epiblast cell  | NA  | CD-1   | UBERON:0000922                         | embryo                                   | MmusDv:0000014             | Theiler stage 09 (mouse)     | CL:0000352                     | epiblast cell                    | not annotated         | CD-1                     | Illumina HiSeq 2500 | single       | NA                  | 2.32718                  | 3621774    | 2049490           | 125              | 125              | 15.34                     | 34.81                                | 1.28                               | 11014               | NA                                          | NA      | SRA         | https://www.ncbi.nlm.nih.gov/sra/?term=ERX1226595 | https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/Mus_musculus/Mus_musculus_Full-Length_SC_RNA-Seq_read_counts_TPM_FPKM_ERP013381.tsv.gz | https://trace.ncbi.nlm.nih.gov/Traces/study/?acc=ERX1226595 |
| ERP013381     | ERX1226596 | UBERON:0000922       | embryo                 | MmusDv:0000014 | Theiler stage 09 (mouse) | CL:0000352   | epiblast cell  | NA  | CD-1   | UBERON:0000922                         | embryo                                   | MmusDv:0000014             | Theiler stage 09 (mouse)     | CL:0000352                     | epiblast cell                    | not annotated         | CD-1                     | Illumina HiSeq 2500 | single       | NA                  | 3.39165                  | 3581718    | 1606871           | 125              | 125              | 13.11                     | 29.75                                | 1.17                               | 9585                | NA                                          | NA      | SRA         | https://www.ncbi.nlm.nih.gov/sra/?term=ERX1226596 | https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/Mus_musculus/Mus_musculus_Full-Length_SC_RNA-Seq_read_counts_TPM_FPKM_ERP013381.tsv.gz | https://trace.ncbi.nlm.nih.gov/Traces/study/?acc=ERX1226596 |

### Experiment file

#### File format and column descriptions

| Column | Content                                                                                                           |                                                                           Example                                                                            |
| ------ | ----------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 1      | [Experiment ID](#experiment-id-column-1-1 'See Experiment ID column description')                                 |                                                                          ERP013381                                                                           |
| 2      | [Experiment name](#experiment-name-column-2 'See Experiment name column description')                             |                                                                   Mouse embryonic RNA-seq                                                                    |
| 3      | [Library count](#library-count-column-3 'See Library count column description')                                   |                                                                             1205                                                                             |
| 4      | [Condition count](#condition-count-column-4 'See Condition count column description')                             |                                                                              4                                                                               |
| 5      | [Organ-stage count](#organ-stage-count-column-5 'See Organ-stage count column description')                       |                                                                              4                                                                               |
| 6      | [Organ count](#organ-count-column-6 'See Organ count column description')                                         |                                                                              1                                                                               |
| 7      | [Stage count](#stage-count-column-7 'See Stage count column description')                                         |                                                                              4                                                                               |
| 8      | [Cell-Type count](#cell-type-count-column-8 'See Cell-Type count column description')                             |                                                                              2                                                                               |
| 9      | [Sex count](#sex-count-column-9 'See Sex count column description')                                               |                                                                              1                                                                               |
| 10     | [Strain count](#strain-count-column-10 'See Strain count column description')                                     |                                                                              1                                                                               |
| 11     | [Data source](#data-source-column-11 'See Data source column description')                                        |                                                                             SRA                                                                              |
| 12     | [Data source URL](#data-source-url-column-12 'See Data source URL column description')                            |                                                          https://www.ncbi.nlm.nih.gov/sra/ERP013381                                                          |
| 13     | [Bgee normalized data URL](#bgee-normalized-data-url-column-13 'See Bgee normalized data URL column description') | https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/Mus_musculus/Mus_musculus_Full-Length_SC_RNA-Seq_read_counts_TPM_FPKM_ERP013381.tsv.gz |
| 14     | [Experiment description](#experiment-description-column-14 'See Experiment description column description')       |                             The study was aimed at interrogating the early stages of blood cell development within the embryo...                             |

##### <a name="experiment-id-column-1-1"></a>Experiment ID (column 1)

The Experiment ID column provides the unique identifier per experiment.

##### <a name="experiment-name-column-2"></a>Experiment name (column 2)

The Experiment name column provides the title referent to the `Experiment ID` (column 1).

##### <a name="library-count-column-3"></a>Library count (column 3)

The Library count column provides the total number of the libraries associated with the `Experiment ID` (column 1).

##### <a name="condition-count-column-4"></a>Condition count (column 4)

The Condition count column provides all the combinations of unique parameters in Bgee. This means, combinations between unique anatomical entities, developmental stages, cell types, sex, and strains.

##### <a name="organ-stage-count-column-5"></a>Organ-stage count (column 5)

The Organ-stage count column provides the total number of unique combinations between anatomical entities Ids `Organ count` (column 6) and developmental stages `Stage count` (column 7) in the target `Experiment ID` (column 1).

##### <a name="organ-count-column-6"></a>Organ count (column 6)

The Organ count column provides the total number of anatomical entity ids in the target `Experiment ID` (column 1).

##### <a name="stage-count-column-7"></a>Stage count (column 7)

The Stage count column provides the total number of developmental stages in the target `Experiment ID` (column 1).

##### <a name="cell-type-count-column-8"></a>Cell-Type count (column 8)

The Cell-Type count column provides the total number of cell types in the target `Experiment ID` (column 1).

##### <a name="sex-count-column-9"></a>Sex count (column 9)

The Sex count column provides the total number of sexes in the target `Experiment ID` (column 1).

##### <a name="strain-count-column-10"></a>Strain count (column 10)

The Strain count column provides the total number of genetic variants or subtypes in the target `Experiment ID` (column 1).

##### <a name="data-source-column-11"></a>Data source (column 11)

Data repository from where the raw files that belong to the `Experiment ID` (column 1) were extracted.

##### <a name="data-source-url-column-12"></a>Data source URL (column 12)

URL pathway to the data repository where is located the `Experiment ID` (column 1).

##### <a name="bgee-normalized-data-url-column-13"></a>Bgee normalized data URL (column 13)

URL pathway where is located the processed data for the correspondent `Experiment ID` (column 1) in Bgee.

##### <a name="experiment-description-column-14 "></a>Experiment description (column 14)

Description provided by the authors of the `Experiment ID` (column 1).

#### Example rows

| Experiment ID | Experiment name                                                                            | Library count | Condition count | Organ-stage count | Organ count | Stage count | Cell-Type count | Sex count | Strain count | Data source | Data source URL                            | Bgee normalized data URL                                                                                                                                     | Experiment description                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------ | ------------- | --------------- | ----------------- | ----------- | ----------- | --------------- | --------- | ------------ | ----------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| ERP013381     | Mouse embryonic RNA-seq                                                                    | 1205          | 4               | 4                 | 1           | 4           | 2               | 1         | 1            | SRA         | https://www.ncbi.nlm.nih.gov/sra/ERP013381 | https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/Mus_musculus/Mus_musculus_Full-Length_SC_RNA-Seq_read_counts_TPM_FPKM_ERP013381.tsv.gz | The study was aimed at interrogating the early stages of blood cell development within the embryo...                                    |
| SRP020490     | Single-cell RNA-Seq reveals dynamic, random monoallelic gene expression in mammalian cells | 118           | 2               | 2                 | 2           | 2           | 2               | 2         | 1            | SRA         | https://www.ncbi.nlm.nih.gov/sra/SRP020490 | https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/Mus_musculus/Mus_musculus_Full-Length_SC_RNA-Seq_read_counts_TPM_FPKM_SRP020490.tsv.gz | In the diploid genome, genes come in two copies, which can have different DNA sequence and where one is maternal and one is paternal... |

## Processed expression (read counts, TPM, FPKM) files

The processed expression (read counts, TPM, FPKM) files can be retrieved per experiment for a specific species, accessed through [FTP](https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/) or through the [download page](/download/processed-expression-values) by selecting the species of interest and then by clicking on the button `Download read counts, TPM, and FPKMs`. When using the web page, all processed data for the species are downloaded. The data for each experiment are contained in separate files named using the experiment identifier. Each experiment file includes all processed data of all samples from the experiment.

#### File format and column descriptions

| Column | Content                                                                                                    |               Example                |
| ------ | ---------------------------------------------------------------------------------------------------------- | :----------------------------------: |
| 1      | [Experiment ID](#experiment-id-column-1-2 'See Experiment ID column description')                          |              SRP020490               |
| 2      | [Library ID](#library-id-column-2-1 'See Library ID column description')                                   |              SRX259105               |
| 3      | [Library type](#library-type-column-3 'See Library type column description')                               |                single                |
| 4      | [Gene ID](#gene-id-column-4 'See Gene ID column description')                                              |          ENSMUSG00000000001          |
| 5      | [Anatomical entity ID](#anatomical-entity-id-column-5 'See Anatomical entity ID column description')       |            UBERON:0000085            |
| 6      | [Anatomical entity name](#anatomical-entity-name-column-6 'See Anatomical entity name column description') |                morula                |
| 7      | [Stage ID](#stage-id-column-7 'See Stage ID column description')                                           |            MmusDv:0000006            |
| 8      | [Stage name](#stage-name-column-8 'See Stage name column description')                                     |       Theiler stage 03 (mouse)       |
| 9      | [Cell type ID](#cell-type-id-column-9 'See Cell type ID column description')                               |              CL:0000353              |
| 10     | [Cell type name](#cell-type-name-column-10 'See Cell type name column description')                        |           blastoderm cell            |
| 11     | [Sex](#sex-column-11 'See Sex column description')                                                         |                  NA                  |
| 12     | [Strain](#strain-column-12 'See Strain column description')                                                | CAST_EiJ(mother)\_x_C57BL_6J(father) |
| 13     | [Read count](#read-count-column-13 'See Read count column description')                                    |                 2154                 |
| 14     | [TPM](#tpm-column-14 'See TPM column description')                                                         |              54.538026               |
| 15     | [FPKM](#fpkm-column-15 'See FPKM column description')                                                      |               55.33224               |
| 16     | [Rank](#rank-column-16 'See Rank column description')                                                      |                 2465                 |
| 17     | [Detection flag](#detection-flag-column-17 'See Detection flag column description')                        |               present                |
| 18     | [pValue](#pvalue-column-18 'See pValue column description')                                                |             3.70353E-06              |
| 19     | [State in Bgee](#state-in-bgee-column-19 'See State in Bgee column description')                           |            Part of a call            |

##### <a name="experiment-id-column-1-2"></a>Experiment ID (column 1)

The Experiment ID column provides the unique identifier per experiment.

##### <a name="library-id-column-2-1"></a>Library ID (column 2)

The Library ID column provides the unique identifier per sample (where each sample is a unique cell) that belongs to an `Experiment ID` (column 1).

##### <a name="library-type-column-3"></a>Library type (column 3)

The Library type column consists of the strandedness of the library. This can be single or paired-end.

##### <a name="gene-id-column-4"></a>Gene ID (column 4)

The Gene ID column provides the unique identifier of genes from Ensembl.

##### <a name="anatomical-entity-id-column-5"></a>Anatomical entity ID (column 5)

The Anatomical entity ID column provides the unique identifier of the anatomical entity, from the Uberon ontology.

##### <a name="anatomical-entity-name-column-6"></a>Anatomical entity name (column 6)

The Anatomical entity name column provides the name of the anatomical entity defined by `Anatomical entity ID` (column 5).

##### <a name="stage-id-column-7"></a>Stage ID (column 7)

The Stage ID column provides the unique identifier of the developmental stage, from the Uberon ontology.

##### <a name="stage-name-column-8"></a>Stage name (column 8)

The Stage name column provides the name of the developmental stage defined by `Stage ID` (column 7).

##### <a name="cell-type-id-column-9"></a>Cell type ID (column 9)

The Cell type ID column provides the unique identifier of the cell type, from the Uberon ontology.

##### <a name="cell-type-name-column-10"></a>Cell type name (column 10)

The Cell type name column provides the name of the cell type defined by `Cell type ID` (column 9).

##### <a name="sex-column-11"></a>Sex (column 11)

The Sex column provides the sex information ('not annotated', 'NA', 'mixed', 'male', 'female', 'hermaphrodite').

##### <a name="strain-column-12"></a>Strain (column 12)

The Strain column provides information about the genetic variant or subtype of an organism.

##### <a name="read-count-column-13"></a>Read count (column 13)

The Read count column provides the total number of reads of `Gene ID` (column 4) from a target `Library ID` (column 2) that will be mapped to the transcriptome.

##### <a name="tpm-column-14"></a>TPM (column 14)

The TPM column provides a normalized quantification measure for sequencing depth and gene length of `Gene ID` (column 4) from a specific `Library ID` (column 2).

##### <a name="fpkm-column-15"></a>FPKM (column 15)

The FPKM column provides a normalized quantification measure for sequencing depth and gene length of `Gene ID` (column 4) from a specific `Library ID` (column 2).

##### <a name="rank-column-16"></a>Rank (column 16)

The Rank column provides the rank of a `Gene ID` (column 4) in a condition for a species. It is used to compute expression ranks and expression scores.

##### <a name="detection-flag-column-17"></a>Detection flag (column 17)

The Detection flag column provides an informative classification of a `Gene ID` (column 4). The flag can be present, which means that the gene is actively expressed or empty classification (NULL).
Note that in single cell RNA-Seq full-length data, we don't call absent genes.
The genes are classified as present based on `pValue` (column 18) cutoff.

##### <a name="pvalue-column-18"></a>pValue (column 18)

The p-value is a quantitative metric to detect if `Gene ID` (column 4) is actively expressed in any standalone RNA-Seq `Library ID` (column 2).

For each individual `Library ID` (column 2) we map reads both to transcripts and to the reference intergenic regions, and compute `TPM` (column 14) per `Gene ID` (column 4) (summing over transcripts) and per intergenic region. Then for each `Gene ID` (column 4) in the `Library ID` (column 2), we compute a Z-score in terms of standard deviations from the mean of reference intergenic regions:

```
                              log2(TPM (column 14)_{Gene ID (column 4)}) - mean(log2(TPM_{RefIntergenic}))
ZScore_{Gene ID (column 4)} = ----------------------------------------------------------------------------
                                                     sd(log2(TPM_{RefIntergenic}))
```

Then for `Gene ID` (column 4) in the `Library ID` (column 2) we calculate a p-value based on a null hypothesis of expression at a similar level to reference intergenic, estimated as a Normal distribution.

The library-specific TPM limit to call genes expressed is the minimum value of TPM where _p-value &#8804; &alpha;_.
In the download files, we used &alpha; = 0.05.

##### <a name="state-in-bgee-column-19"></a>State in Bgee (column 19)

The State in Bgee column provides information about the usage of `Gene ID` (column 4) to make expression calls.
Three different labels can be retrieved in this column:

1. Part of a call --> This means the information from the `Gene ID` (column 4) was used to make an expression informative call.
2. Result excluded, reason: pre-filtering --> Pre-filtering of genes never observed as present in any `Library ID` (column 2). No calls will be generated for those `Gene ID` (column 4).
3. Result excluded, reason: absent call not reliable --> protocol used to generate the `Library ID` (column 2) does not allow to consider `Gene ID` (column 4) for absent calls.

#### Example rows

| Experiment ID | Library ID | Library type | Gene ID            | Anatomical entity ID | Anatomical entity name | Stage ID       | Stage name               | Cell type ID | Cell type name  | Sex | Strain                               | Read count | TPM       | FPKM      | Rank | Detection flag | pValue      | State in Bgee                                     |
| ------------- | ---------- | ------------ | ------------------ | -------------------- | ---------------------- | -------------- | ------------------------ | ------------ | --------------- | --- | ------------------------------------ | ---------- | --------- | --------- | ---- | -------------- | ----------- | ------------------------------------------------- |
| SRP020490     | SRX259105  | single       | ENSMUSG00000000001 | UBERON:0000085       | morula                 | MmusDv:0000006 | Theiler stage 03 (mouse) | CL:0000353   | blastoderm cell | NA  | CAST_EiJ(mother)\_x_C57BL_6J(father) | 2154       | 54.538026 | 55.33224  | 2465 | present        | 3.70353E-06 | Part of a call                                    |
| SRP020490     | SRX259105  | single       | ENSMUSG00000000003 | UBERON:0000085       | morula                 | MmusDv:0000006 | Theiler stage 03 (mouse) | CL:0000353   | blastoderm cell | NA  | CAST_EiJ(mother)\_x_C57BL_6J(father) | 0          | 0         | 0         | NA   |                | NA          | Result excluded, reason: absent call not reliable |
| SRP020490     | SRX259105  | single       | ENSMUSG00000000028 | UBERON:0000085       | morula                 | MmusDv:0000006 | Theiler stage 03 (mouse) | CL:0000353   | blastoderm cell | NA  | CAST_EiJ(mother)\_x_C57BL_6J(father) | 341.9999   | 16.191957 | 16.427753 | 4671 | present        | 8.89015E-05 | Part of a call                                    |
