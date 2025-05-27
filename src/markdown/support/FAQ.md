# Frequently asked questions (FAQ)

## Table of contents

Got questions? We've got answers! Here, you can find Bgee team answers in response to the most frequently asked questions. If you don't find answers here, please do not hesitate to contact us, using [Bgee e-mail](mailto:Bgee@sib.swiss). And maybe a new collaboration will take place as it has already been (see the [collaboration page](/about/collaborations)).

## Are all tissues tested in every species, e.g. in both mouse and rat?

We integrate publicly available data, and different species are studied in more or less details. Only tissues with detected active expression are displayed in the gene page on our website. If you use the files available for download (from here [Genes expression calls](/download/gene-expression-calls)), you can see report of tissues with absence of expression. This will give you a definitive answer about which, e.g., mouse/rat tissues were studied.

## Why do you use chimpanzee gene IDs for bonobo data?

When generating data for Bgee release 14, the bonobo genome was not yet available in Ensembl. So, bonobo RNA-Seq libraries are mapped to the chimpanzee genome, and `ENSPTRG` chimpanzee gene IDs are reported. Since the bonobo genome has been made available December 2017 in Ensembl, Bgee release 15 will use the actual bonobo genome as reference. In the meantime, you can use Ensembl tools to retrieve a mapping from chimpanzee genes to bonobo orthologs. We are sorry for the inconvenience.

## Why are there differences between interface results and downloadable files?

This depends on the way the query is submitted. If you are only interested in gene expression in anatomical entities, ignoring developmental stages, you will see some differences between the gene Web page and the download files: for a given anatomical entity the gene Web page shows the lowest rank of all pairs of anatomical entity-developmental stages (you can click on the button to see the ranks for all stages of a given anatomical entity). For the moment, the download files do not contain the minimum expression value. We are probably going to modify our download files to be coherent with the approach.Furthermore, in the Web application some anatomical entities are filtered. If one gene is expressed in one anatomical entity (brain) but is more expressed in a subpart of this anatomical entity (cerebellum), then we remove the anatomical entity itself (brain) from the gene web page and only keep the gene expression value of the subpart (cerebellum).

## Why don't you use standard names for developmental stages?

We use as input one specific developmental stage ontology for each species, and we then merge all these species-specific developmental ontologies into one single multi-species ontology. To do that, we use broad developmental stages described in the [Uberon ontology](https://github.com/obophenotype/developmental-stage-ontologies/tree/master/src): either we map some of the species-specific stages to these Uberon broad developmental stages (i.e., equivalent classes), or we attach some of the species-specific stages as children of these Uberon developmental stages (i.e., subclasses).

You can find all 'source' species-specific ontologies we develop in this [repository](https://github.com/obophenotype/developmental-stage-ontologies/tree/master/src). For _C. elegans_, we rely on the [WBls ontology](http://www.obofoundry.org/ontology/wbls.html) developed by WormBase (we also rely on external ontologies for fly, zebrafish, and xenopus).

You can find the ontology merging all these species-specific ontologies with Uberon here: [dev_stage_ontology.obo](https://github.com/obophenotype/developmental-stage-ontologies/blob/master/external/bgee/dev_stage_ontology.obo). You can find an overview of the resulting merge for _C. elegans_ in [this report](https://github.com/obophenotype/developmental-stage-ontologies/blob/master/external/bgee/report.md#caenorhabditis-elegans).

In the ontology, developmental stages are ordered thanks to the use of the relations `preceded_by` and `immediately_preceded_by`.
An example of apparent non-standard nomenclature arises for _C. elegans_ a specific _C. elegans_ developmental stage is mapped to a broad Uberon stage. For instance, several WBls stages are mapped to the same Uberon term `UBERON:0000092` (post-embryonic stage): `WBls:0000022` (postembryonic Ce), `WBls:0000093` (Brugia postembryonic stage), `WBls:0000103` (postembryonic nematode); these mappings are cross-references in the ontology file.

Similarly, some Uberon terms have no equivalent in WBls, as for instance `UBERON:0007220` (late embryonic stage). In that case, we mapped the terms `WBls:0000015` (elongating embryo Ce) and `WBls:0000021` (fully-elongated embryo Ce) as children of `UBERON:0007220`. As a result, the non-standard term (late embryonic stage) will show up in the nomenclature for _C. elegans_.

## Can I find information on strain and/or sex?

Bgee contains only manually curated healthy wild-type expression data (e.g., no gene knock-out, no treatment, no disease). Currently (Bgee release 14), information on strain or sex is not available in files that provide calls of baseline presence/absence of expression (see [Gene expression calls](/download/gene-expression-calls)). However, information is available in files that provide annotations and experiment information or processed expression values (see [Processed expression values](/download/processed-expression-values)). It is also possible to download these data directly into R using our [R package](https://bioconductor.org/packages/BgeeDB/).

## Are there multi-species comparison available in gene expression calls?

These files are not currently available.

## What can I do with my genes of interest?

Each gene can be visualized one by one via [our gene search](/search/genes). You can also visualize enrichment of expression of your list relative to a random background using [TopAnat](/analysis/top-anat). All associated data can be downloaded using our [R package](https://bioconductor.org/packages/BgeeDB/). Note that there is at present no way to visualize a list of genes.

## Do you have protein expression?

No, Bgee only includes RNA level expression data. _In situ_ means _in situ_ hybridization of RNA only.
