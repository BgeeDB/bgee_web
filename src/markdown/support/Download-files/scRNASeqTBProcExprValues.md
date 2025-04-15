# Droplet-Based scRNA-seq Processed Expression Values Files

The Bgee database provides scRNA-seq data, specifically from droplet-based experiments, along with their associated metadata in the H5AD file format. This format facilitates quick access and manipulation of large-scale single-cell RNA sequencing datasets and their metadata.

## Download Processed Expression Files

The processed expression files can be retrieved per experiment for a specific species, accessed through [FTP](https://bgee.org/ftp/current/download/processed_expr_values/sc_rnaseq/) or through the [download page](/download/processed-expression-values) by selecting the species of interest and then by clicking on the button `Download read counts, TPM, and FPKMs`. When using the web page, all processed data for the species are downloaded. The data for each experiment are contained in separate files named using the experiment identifier. Each experiment file includes all processed data of all samples from the experiment.

## About the H5AD File Format

H5AD is an extension of the [HDF5](https://en.wikipedia.org/wiki/Hierarchical_Data_Format) file format, designed for storing large annotated high-dimensional data arrays, such as scRNA-seq data. It offers efficient storage with built-in compression, reducing file sizes and enabling quicker data transfers. Additionally, its binary structure allows for rapid, indexed data retrieval without loading the entire dataset, and its hierarchical organization ensures structured storage of diverse data levels, from raw counts to metadata. Many single-cell analysis tools and databases favor this format.

## Bgee's H5AD File Contents

In each H5AD file representing a single experiment, you will find:

1. **Main Matrix**:
   A central matrix that records the UMI (Unique Molecular Identifier) count data. Each row corresponds to a unique cell, while each column is aligned with a specific gene. The numeric value at a given matrix position reflects the UMI count, indicating the expression level of that gene in the corresponding cell.
2. **Metadata**: Accompanying the main matrix are annotations for each cell. These annotations offer insights into the cell's origin and characteristics.

## Metadata Details

For every cell in the matrix, the following metadata is provided:

- **barcodes**: Unique sequences associated with individual cells or nuclei.
- **SampleId**: Sample identifier from which the cell was derived.
- **anatEntityId**: Unique identifier of the anatomical entity, from the Uberon ontology.
- **stageId**: Unique identifier of the developmental stage of the specimen, from the Uberon ontology.
- **cellTypeId**: Unique identifier of the cell type, from the Uberon ontology.
- **strain**: Genetic strain or variant information of the specimen.
- **sex**: Biological sex of the specimen ('not annotated', 'NA', 'mixed', 'male', 'female', 'hermaphrodite').
- **speciesId**: Code representing the species of the specimen.
- **anatEntityName**: Name of the anatomical structure/source.
- **stageName**: Name of the developmental stage of the specimen.
- **cellTypeName**: Name of the cell type.
- **libID**: Unique library identifier.
- **unique_cell_ids**: A distinct identifier ensuring every cell across the database is individually recognizable.

## Usage

To access and manipulate the data in H5AD files, users can utilize the [`scanpy`](https://scanpy.readthedocs.io/) library in Python. This library offers a rich suite of methods for preprocessing, visualizing, and analyzing single-cell data.

### Example:

```python
import scanpy as sc

# Load H5AD file
adata = sc.read("path_to_your_file.h5ad")

# Access main matrix
matrix = adata.X

# Access metadata
metadata = adata.obs
```
