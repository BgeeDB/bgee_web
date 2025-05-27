# Data Curation in Bgee

Bgee is a database for retrieval and comparison of gene expression patterns across multiple animal species. Bgee is based exclusively on curated healthy wild-type expression data to provide a comparable reference of gene expression. The data included in Bgee undergoes manual curation to ensure all metadata captured is accurate and reliable. For this purpose, ontologies are used to annotate anatomical entities, developmental stages, and cell types to support simple comparisons between species and the propagation of information.

- [Introduction](#introduction 'Quick jump to this section')
  - [What is “Healthy Wild-Type”?](#what-is-healthy-wild-type 'Quick jump to this section')
  - [What Data are Captured?](#what-data-are-captured 'Quick jump to this section')
- [Annotation Process](#annotation-process 'Quick jump to this section')
  - [Ontologies Used](#ontologies-used 'Quick jump to this section')
  - [Anatomical Entity](#anatomical-entity 'Quick jump to this section')
  - [Developmental Stage](#developmental-stage 'Quick jump to this section')
  - [Cell Type](#cell-type 'Quick jump to this section')
  - [Strain/Ethnicity](#strainethnicity 'Quick jump to this section')
  - [Sex](#sex 'Quick jump to this section')
  - [Technologies and Protocols](#technologies-and-protocols 'Quick jump to this section')
- [Multi-Species Integration](#multi-species-integration 'Quick jump to this section')

## Introduction

### How are experiments identified for annotation?

We use a few different methods for identifying experiments for annotation. We use a python and an R script to mine the SRA for experiments to annotate. We also accept external and internal requests for annotation, in addition to taking on large annotation projects like GTEx and Fly Cell Atlas.

### What is "healthy wild-type"?

Before annotation, we check that the samples are considered healthy wild-type by the Bgee definition, particularly no knock-outs, no mutations, no cancer or other diseases, and no treatment. This step is to ensure that all data in the Bgee database represents healthy wild-type expression data.

Some common scenarios we exclude: cell lines, cell cultures, intestinal germ-free animals, injured animals, polysomal RNA only hybridized, and animals killed by exsanguination under CO2 anesthesia.

Some common scenarios we include: BMI greater than 18.5 and less than 35, fasted animals (considering reasonable fasting time), dark/light circadian rhythms and temperature variation when reasonable for the animal's physiology, short duration low or high-fat diet, mammary glands from virgin, pregnant, and lactating females, oocytes at different stages of maturation, placenta and extraembryonic components during development, animals selected for their behavior, animals from different strains/ethnicities, human post-mortem tissues, light impulse to stress the animals, killed by cervical dislocation or decapitation, and killed by inhalants (CO2).

### What data are captured?

Various data are captured and manually checked, and several data fields must be captured using controlled vocabularies or ontologies. The following data are always captured:

Sample metadata:

- anatomical entity and/or cell type, developmental stage, sex, strain/ethnicity, species

Experiment metadata:

- scRNA-seq and bulk RNA-seq: library ID, experiment ID, sequencing technology, sequencing platform, sequenced transcript part (3', 5' or full length)
- affymetrix: experiment ID, chip ID
- in situ hybridization: experiment ID, evidence ID
- EST: library ID

## Annotation Process

### Ontologies Used

The following ontologies are used for the associated use cases listed below.
| Ontology | OBO Prefix | Use Case | Last Import |
|:--|:--|:--|:--|
| [Uberon composite metazoan anatomy ontology] | UBERON, others | anatomical structure annotation | 2020-09-16 |
| [NCBI organismal classification] | NCBITaxon | species annotation | 2020-12-14 |
| [Composite developmental and life stage ontology] | UBERON, others | developmental stage annotation | 2021-03-01 |
| [Cell Ontology] | CL | cell type annotation | 2020-09-16 |

[Uberon composite metazoan anatomy ontology]: http://www.obofoundry.org/ontology/uberon.html
[NCBI organismal classification]: http://obofoundry.org/ontology/ncbitaxon.html
[Composite developmental and life stage ontology]: https://github.com/obophenotype/developmental-stage-ontologies/
[Cell Ontology]: http://obofoundry.org/ontology/cl.html

### How are data annotated with ontologies?

Bgee manually curates expression data using ontologies and controlled vocabularies to ensure accurate annotation, allow data propagation, and support species-to-species comparisons. The Bgee curators prioritize using the most accurate term to annotate data. We also internally keep track of the quality of each annotation to support re-annotation and annotation quality control. Generally, when there is no indication provided for annotation, the root of the ontology is used.

### Anatomical Entity

Uberon, the multi-species anatomy ontology is used to annotate anatomical entities. When the experiment is done using cells it can be appropriate to annotate using the Cell Ontology. Additionally, there will be cases where the anatomical entity is a post-composition of an anatomical structure and a cell type. There are a few special cases to look out for, which are listed below.
| Term | Uberon ID | Uberon Name |
|:--|:--|:--|
| missing organ, embryo stage | UBERON:0000922 | embryo |
| missing organ, adult stage | UBERON:0007023 | adult organism |
| missing organ, unknown stage | UBERON:0000465 | material anatomical entity |
| muscle | UBERON:0002385 | muscle tissue |
| skeletal muscle | UBERON:0001134 | skeletal muscle tissue |
| human breast | UBERON:0005200 | thoracic mammary gland |
| skin | UBERON:0000014 | zone of skin |
| whole organism adult or whole body adult | UBERON:0007023 | adult organism |
| Broca's area | UBERON:0001870 | frontal cortex |
| hippocampus | UBERON:0001954 | Ammon's horn |
| unfertilized egg | CL:0000025 | egg cell |

### Developmental Stage

We use species-specific developmental stage ontologies when available for the species. When a species does not have a dedicated developmental stage ontology, we report the developmental stages directly by using the metastages of Uberon. Alternatively, we create species-specific developmental stage ontologies when none exist for a given species. For species-to-species comparisons, all developmental stage ontologies are mapped back to the metastages of Uberon.

The following species-specific developmental stage ontologies are used in Bgee:
| Species | Ontology |
|:--|:--|
| human | hsapdv.obo |
| mouse | mmusdv.obo |
| fly | fbdv.obo |
| zebrafish | zfs.obo |
| worm (c. elegans) | wbls.obo |
| frog | xao.obo |
| rat | rnordv.obo |
| cow | btaudv.obo |
| lizard | acardv.obo |
| chicken | ggaldv.obo |
| gorilla | ggordv.obo |
| opossum | mdomdv.obo |
| rhesus macaque | mmuldv.obo |
| platypus | oanadv.obo |
| bonobo | ppandv.obo |
| orangutan | ppygdv.obo |
| chimpanzee | ptrodv.obo |
| pig | sscrdv.obo |
| medaka | olatdv.obo |
| platynereis | pdumdv.obo |

### Cell Type

The cell ontology is used to annotate cell type. This is only applicable to single-cell RNA-seq experiments. Bgee does not perform its own clustering and cell type annotation, instead the cell type annotations provided by the authors are mapped back to the most appropriate cell ontology term.

### Strain/Ethnicity

We use the [UniProt controlled vocabulary](https://ftp.uniprot.org/pub/databases/uniprot/current_release/knowledgebase/complete/docs/strains) to report strains.

We report 'subspecies' (as defined by [NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy)) as a strain with the parent species annotated as the 'speciesId'.

For humans, this field is where we annotate ethnicity. The accepted values (as suggested by the [FDA](https://www.pharmasug.org/proceedings/2015/SS/PharmaSUG-2015-SS06.pdf)) are American Indian or Alaska Native, Asian, Black or African American, Native Hawaiian or Other Pacific Islander, and White.

### Sex

Sex is used to annotate the sex of the animal the sample was taken from. The possible values are male, female, hermaphrodite, NA (not available or unknown), or mixed (mixture of different sexes in the sample).

### Technologies and Protocols

We have a list of acceptable protocols for both scRNA-seq and bulk RNA-seq, listed below. We try to capture information about the kit used for preparing libraries to determine which RNA population could be captured. More information about scRNA-seq protocols can be found in our [comparative guide](/support/scRNA-seq-protocols-comparison).

| bulk RNA-seq                 | scRNA-seq       |
| :--------------------------- | :-------------- |
| Illumina Genome Analyzer     | Smart-seq       |
| Illumina Genome Analyzer II  | Smart-seq2      |
| Illumina Genome Analyzer IIx | 10X Chromium V2 |
| Illumina HiScanSQ            | 10X Chromium V3 |
| Illumina HiSeq 1000          |                 |
| Illumina HiSeq 1500          |                 |
| Illumina HiSeq 2000          |                 |
| Illumina HiSeq 2500          |                 |
| Illumina HiSeq 3000          |                 |
| Illumina HiSeq 3500          |                 |
| Illumina HiSeq 4000          |                 |
| Illumina HiSeq X Ten         |                 |
| Illumina MiSeq               |                 |
| Illumina NextSeq 500         |                 |
| Illumina NextSeq 550         |                 |
| Illumina NovaSeq 6000        |                 |
| Ion Torrent Proton           |                 |

## Multi-Species Integration

To make our annotations comparable between species, we remap all source information to the composite-metazoa version of Uberon.
This means that we carefully check and use cross-references in Uberon and other ontologies to map, for instance, data from [ZFIN](https://zfin.org/)
or [FlyBase](https://flybase.org/) to this common representation.

We also use the taxon constraints (for instance this [Protégé plugin](https://github.com/geneontology/protege-taxon-constraints))
and lineage-specific General Class Inclusion (GCI) relations to produce species-specific anatomical representations from this common ontology,
which integrates almost all other animal anatomy ontologies.

Finally, we define relations of historical homology between anatomical entities to determine which entities can be compared between species. See our [Anatomical homology search](https://www.bgee.org/search/anatomical-homology) and our [repository of similarity annotations between anatomical structures](https://github.com/BgeeDB/anatomical-similarity-annotations) for more information.
