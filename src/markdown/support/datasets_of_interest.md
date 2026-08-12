# Datasets of Interest

This page describes large datasets of interest in Bgee, specifically how they were annotated and how to access the data.

- [GTEx in Bgee](#gtex-in-bgee 'Quick jump to this section')
  - [Annotation process](#annotation-process 'Quick jump to this section')
  - [Accessing GTEx data in Bgee](#accessing-gtex-data-in-bgee 'Quick jump to this section')
    - [GTEx data on the Bgee website](#gtex-data-on-the-bgee-website 'Quick jump to this section')
    - [GTEx data using BgeeDB R package](#gtex-data-using-bgeedb-r-package 'Quick jump to this section')
- [Fly Cell Atlas in Bgee](#fly-cell-atlas-in-bgee 'Quick jump to this section')
  - [Annotation process](#annotation-process-1 'Quick jump to this section')
  - [Accessing Fly Cell Atlas data in Bgee](#accessing-fly-cell-atlas-data-in-bgee 'Quick jump to this section')
    - [Fly Cell Atlas data on the Bgee website](#fly-cell-atlas-data-on-the-bgee-website 'Quick jump to this section')
    - [Fly Cell Atlas data using BgeeDB R package](#fly-cell-atlas-data-using-bgeedb-r-package 'Quick jump to this section')

## INSTALL AND RUN THE BgeeDB R PACKAGE

More information and examples can be found on the [BgeeDB R package page](https://bioconductor.org/packages/BgeeDB/).

```R
    if (!requireNamespace("BiocManager", quietly = TRUE))
        install.packages("BiocManager")
    BiocManager::install("BgeeDB")
    library(BgeeDB)
```

Example of a TopAnat analysis, which leverages the power of abundant data integrated with many smaller datasets to provide biological insight into gene lists.

```R
    bgee <- Bgee$new(species = "Homo_sapiens")
    myTopAnatData <- loadTopAnatData(bgee)
    # Retrieve all genes with data in Bgee
    allGenes <- unique(row.names(myTopAnatData$gene2anatomy))
    # Define the list of genes of interest
    genesOfInterest <- c(...) # your real Ensembl IDs
    # Show gene(s) not in background, if any
    missing <- setdiff(genesOfInterest, allGenes)
    if (length(missing) > 0)
        warning(length(missing), " gene(s) not in background and will be dropped: ",
                paste(missing, collapse = ", "))
    # Build the gene vector for the analysis
    geneList <- factor(as.integer(allGenes %in% genesOfInterest), levels = c(0, 1))
    stopifnot(sum(geneList == 1) > 0)  # bail early if foreground is empty
    names(geneList) <- allGenes
    # Run the test
    myTopAnatObject <- topAnat(myTopAnatData, geneList)
    resFis <- runTest(myTopAnatObject, algorithm ="elim", statistic ="fisher")
    # Format results
    tableOver <- makeTable(myTopAnatData, myTopAnatObject, resFis, 0.1)
    tableOver
```

## GTEx in Bgee

In addition to the continuous growth of transcriptomics datasets, some specific projects produce large amounts of data, generated and accessible in a consistent manner, as, notably, the [GTEx project](https://www.gtexportal.org/). The GTEx project aims at building a comprehensive resource for tissue-specific gene expression in human. Here we describe how this dataset was integrated into Bgee.

### Annotation process

We applied a stringent re-annotation process to the GTEx data to retain only healthy tissues and non-contaminated samples, using the information available under restricted access. For instance, we rejected all samples for 31% of subjects, deemed globally unhealthy from the pathology report (e.g., drug abuse, diabetes, BMI > 35), as well as specific samples from another 28% of subjects who had local pathologies (e.g., brain from Alzheimer patients). We also rejected samples with contamination from other tissues.

In total, only 50% of samples were kept; these represent a high quality subset of GTEx. All these samples were re-annotated manually to specific Uberon anatomy and aging terms.

The GTEx annotations can be browsed on our curated data interface: [Curated GTEx data in Bgee](/experiment/SRP012682).

### Accessing GTEx data in Bgee

All corresponding RNA-seq were reanalyzed in the Bgee pipeline, consistently with all other healthy RNA-seq from human and other species. These data are being made available both through the website, and through the [BgeeDB R package](https://bioconductor.org/packages/BgeeDB/) (with sensitive information hidden).

#### GTEx data on the Bgee website

- Annotations can be browsed on our curated data interface: [Curated GTEx data in Bgee](/experiment/SRP012682). Annotations can be downloaded from [RNA-Seq human experiments/libraries info](https://bgee.org/ftp/current/download/processed_expr_values/rna_seq/Homo_sapiens/Homo_sapiens_RNA-Seq_experiments_libraries.tar.gz). The Experiment ID for GTEx is `SRP012682`.
- Processed expression values for GTEx data are available via FTP ([download file](https://bgee.org/ftp/current/download/processed_expr_values/rna_seq/Homo_sapiens/Homo_sapiens_RNA-Seq_read_counts_TPM_SRP012682.tsv.gz)).
- Gene expression calls from GTEx and other experiments are found in the [human gene expression files](/download/gene-expression-calls?id=9606).
- Each human gene page includes GTEx data where applicable (search a gene [here](/search/genes)).
- TopAnat analyses can be performed [here](/analysis/top-anat), which leverage the power of the abundant GTEx data integrated with many smaller datasets to provide biological insight into gene lists.

#### GTEx data using BgeeDB R package

- Annotations can be retrieved from RNA-Seq human experiments/libraries information. The experiment ID for GTEx is `SRP012682`. And quantitative expression data and presence calls can be loaded.
  ```R
      bgee <- Bgee$new(species = "Homo_sapiens", dataType = "rna_seq")
      # This step can take a lot of time and memory as Bgee data have to be downloaded and uncompressed.
      data <- getSampleProcessedData(bgee, experimentId = "SRP012682")
  ```

## Fly Cell Atlas in Bgee

The adult [Fly Cell Atlas (FCA)](https://flycellatlas.org/) is a comprehensive single-cell transcriptomic atlas of _Drosophila melanogaster_, which includes 580k cells from 15 individually dissected sexed tissues, as well as from the entire head and body. It includes more than 250 distinct cell types across tissues.

### Annotation Process

In addition to using the fly-specific vocabularies for annotation (i.e., FBbt ontology), Bgee reconnects these data to species-neutral terms (i.e., from Uberon and CL ontologies) to enhance comparisons between species, while still conserving precise fly-specific terms when necessary. All annotations were verified and re-curated to ensure consistency between cell types and organismal information.

### Accessing Fly Cell Atlas data in Bgee

All corresponding scRNA-seq data were reanalyzed in the Bgee pipeline. These data are available both through the website and through the BgeeDB R package.

#### Fly Cell Atlas data on the Bgee website

- Annotations can be browsed on our curated data interface: [Curated Fly Cell Atlas data in Bgee](/experiment/ERP129698). Annotations can be downloaded from [scRNA-seq experiments/libraries info](https://bgee.org/ftp/current/download/processed_expr_values/droplet_based/Drosophila_melanogaster/Drosophila_melanogaster_Droplet-Based_SC_RNA-Seq_experiments_libraries.tar.gz). The Experiment ID for FCA is `ERP129698`.
- Annotations and expression data can be downloaded in tsv or H5AD format from the [experiment page](/experiment/ERP129698). They are also available via FTP ([download file](https://bgee.org/ftp/current/download/processed_expr_values/droplet_based/Drosophila_melanogaster/Drosophila_melanogaster_Droplet-Based_SC_RNA-Seq_read_counts_CPM_ERP129698.tsv.gz)).
- Gene expression calls from FCA and other experiments are found in the [Drosophila melanogaster (fruit fly) expression files](/download/gene-expression-calls?id=7227).
- Each _Drosophila melanogaster_ (fruit fly) gene page includes FCA data where applicable (search a gene [here](/search/genes)).
- TopAnat analyses can be performed [here](/analysis/top-anat), which leverage the power of the abundant FCA data integrated with many smaller datasets to provide biological insight into gene lists.

#### Fly Cell Atlas data using BgeeDB R package

- Annotations can be retrieved from scRNA-Seq _D. melanogaster_ experiments/libraries information. The experiment ID for Fly Cell Atlas is `ERP129698`. And quantitative expression data and presence calls can be loaded.
  ```R
      bgee <- Bgee$new(species = "Drosophila_melanogaster", dataType = "sc_droplet_based")
      # This step can take a lot of time and memory as Bgee data have to be downloaded and uncompressed.
      data <- getSampleProcessedData(bgee, experimentId = "ERP129698")
  ```
