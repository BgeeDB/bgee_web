# Processed Expression Values Files

The [processed expression values](/download/processed-expression-values) page is a landing page for expression data (e.g. read counts, TPMs, FPKMs) and annotation metadata (e.g. anatomical entities, developmental stages, sex, strain, quality scores). These files are divided by species and data type (bulk RNA-Seq, full-length single-cell RNA-Seq, and droplet-based single-cell RNA-Seq). To get more information on the download file for a specific data type, follow the relevant link below.

- [RNA-Seq](/support/tutorial-processed-expression-values-download-RNA-seq)
- [full-length single cell RNA-Seq](/support/tutorial-processed-expression-values-download-scRNA-seq-full-length)
- [droplet-based single cell RNA-Seq](/support/tutorial-processed-expression-values-download-scRNA-seq-droplet-based)

![](../img/doc/Download-files/Processed-expression-homepage.png#tutoimgborder)

## Download processed expression data and annotation metadata

To access the download page from the Bgee homepage, go to the download section on the top toolbar and click on "Processed expression values". This will bring you to the download page where you can either search for a specific species in the top search bar or look through the species list at the bottom and click on any species logo to see the different download file options available for each data type. These datasets can also be downloaded directly using our R package [BgeeDB](https://bioconductor.org/packages/release/bioc/html/BgeeDB.html).

![](../img/doc/Download-files/Processed-expression-Species-data-types.png#tutoimgborder)

## Potential download problems

- If you open a file with a spreadsheet editor, it will potentially transform some cell values into dates. Files need to be **imported** into a spreadsheet editor to avoid such problems.
- Download files are compressed with gzip. They have to be **uncompressed** before opening them into an editor.
- Tarball containing TPM values for a species contain gzip files that also need to be uncompressed before opening with an editor.
