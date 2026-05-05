# Querying the Bgee Knowledge Graph with SPARQL

- [Introduction](#introduction 'Quick jump to this section')
- [Querying Species](#querying-species 'Quick jump to this section')
- [Querying Gene Expression Profile](#querying-gene-expression-profile 'Quick jump to this section')
  - [Where is a Gene Expressed](#where-is-a-gene-expressed 'Quick jump to this section')
  - [In What Cell Types is a Gene Expressed](#in-what-cell-types-is-a-gene-expressed 'Quick jump to this section')
  - [Where is a Gene Expressed and its Expression Score](#where-is-a-gene-expressed-and-its-expression-score 'Quick jump to this section')
- [Querying with Controlled Vocabularies and Identifiers](#querying-with-controlled-vocabularies-and-identifiers 'Quick jump to this section')
  - [Taxonomy Identifiers](#taxonomy-identifiers 'Quick jump to this section')
  - [Gene Identifiers](#gene-identifiers 'Quick jump to this section')
  - [Anatomical Entity Vocabulary](#anatomical-entity-vocabulary 'Quick jump to this section')
  - [Developmental Stage Vocabulary](#developmental-stage-vocabulary 'Quick jump to this section')
- [Querying with UniProtKB cross-references](#querying-with-uniprotkb-cross-references 'Quick jump to this section')
- [Querying Gene Metadata](#querying-gene-metadata 'Quick jump to this section')
- [Querying Genes with Absence of Expression](#querying-genes-with-absence-of-expression 'Quick jump to this section')
- [Programmatic access to the latest version of the Bgee SPARQL endpoint](#programmatic-access-to-the-latest-version-of-the-bgee-sparql-endpoint 'Quick jump to this section')
- [Stable programmatic access to this version of the Bgee SPARQL endpoint](#stable-programmatic-access-to-this-version-of-the-bgee-sparql-endpoint 'Quick jump to this section')
- [RDF serialisation and semantic models](#rdf-serialisation-and-semantic-models 'Quick jump to this section')

## Introduction

In this tutorial, we will demonstrate how to build complex queries to retrieve gene expression information. We will build them step-by-step based on simple queries. The language used for querying the Bgee knowledge graph is [SPARQL](https://www.w3.org/TR/sparql11-overview/). The Bgee graph was built based on the [GenEx semantic model](https://biosoda.github.io/genex/).

Bgee has a SPARQL endpoint which is based on the EasyBgee database ([see documentation on Bgee pipeline GitHub](https://github.com/BgeeDB/bgee_pipeline/tree/master/pipeline/easybgee_creation)). EasyBgee is a view of the Bgee database, that contains the most useful, and explicit information.

Bgee SPARQL queries can be run using the [Bgee SPARQL endpoint](https://bgee.org/sparql/), or using the web interface [Bio-Query](https://purl.org/bioquery) search created for the [BioSODA project](https://biosoda.expasy.org/). Bgee specific queries are present under the category `Bgee database queries`. It is possible to see the SPARQL queries and edit them by clicking on the `Show SPARQL Query Editor` button. Moreover, Bio-Query allows for writing federated queries among UniProt, OMA and Bgee SPARQL endpoints.

The following sections describe queries that can be run directly in our [SPARQL endpoint webpage](https://bgee.org/sparql/). Nevertheless, the Bgee SPARQL endpoint (see its webpage header below) can also be queried using your preferred programming language such as with the [SPARQLWrapper](https://sparqlwrapper.readthedocs.io/en/latest/) package for the Python language or the [R SPARQL](http://www.r-bloggers.com/sparql-with-r-in-less-than-5-minutes/) package for the R language.

![](../img/doc/sparql-tutorial/bgee-sparql-endpoint.png#tutoimgborder)

To improve readability, all reserved words of the SPARQL query language are written in capital letters. As per the SPARQL language:

- All variables are defined by starting with a question mark `?`.
- The graph patterns are stated as triples ended with a full stop (.): `subject predicate object .`.
- Results are projected via the variables that are defined in the query header such as the reserved word `SELECT`.

## Querying species

[Q01](#q01) is a SPARQL query to retrieve species that are present in Bgee.

#### Q01:

> _Question_: What are the species present in Bgee?
> _SPARQL query_:

```
PREFIX up: <http://purl.uniprot.org/core/>
SELECT ?species {
	?species a up:Taxon .
}
```

All species are defined as a `up:Taxon` where `up:` is the prefix for `http://purl.uniprot.org/core/` (the UniProtKB core ontology). See below a graphical representation of the [Q01](#q01) query:

![](../img/doc/sparql-tutorial/q01.png#tutoimgborder)

A species in Bgee may have the following attributes (i.e., properties):

- `up:scientificName` (**always present**): the scientific name of a species such as "Homo sapiens".
- `up:commonName` (**optionally stated**): the common name of a species such as "human", note that this attribute is not always present, it depends on the species.
- `up:rank` (**always present**): taxonomic rank is the relative level of a group of organisms (a taxon) in an ancestral or hereditary hierarchy (e.g. species, kingdom, family).
  Currently, in Bgee, only the "species" rank is stated (i.e.,`up:rank` is always `up:Species`).

[Q02](#q02) is the whole SPARQL query including all direct attributes for `up:Taxon` along with its [graphical representation](#q02-graphical-representation).

#### Q02:

> _Question_: What are the species present in Bgee and their scientific and common names?
> _SPARQL query_:

```
PREFIX up: <http://purl.uniprot.org/core/>
SELECT ?species ?sci_name ?common_name {
	?species a up:Taxon .
	?species up:scientificName ?sci_name .
	?species up:rank up:Species .
	OPTIONAL { ?species up:commonName ?common_name . }
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0ASELECT+%3Fspecies+%3Fsci_name+%3Fcommon_name+%7B%0D%0A%09%3Fspecies+a+up%3ATaxon+.%0D%0A%09%3Fspecies+up%3AscientificName+%3Fsci_name+.%0D%0A%09%3Fspecies+up%3Arank+up%3ASpecies+.%0D%0A++++OPTIONAL+%7B%3Fspecies+up%3AcommonName+%3Fcommon_name+.%7D%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q02 graphical representation:

![](../img/doc/sparql-tutorial/q02.png#tutoimgborder)

## Querying gene expression profile

All anatomic entities and developmental stages are represented with the [UBERON ontology](https://www.ebi.ac.uk/ols4/ontologies/uberon) or related ontologies as controlled vocabularies.

### Where is a gene expressed?

Genes that are expressed in a tissue, organ, or cell (i.e., anatomical entity in general) are represented with the relation
[genex:isExpressedIn](https://biosoda.github.io/genex/#isExpressedIn), alternatively its corresponding relation [obo:RO_0002206](http://purl.obolibrary.org/obo/RO_0002206) is stated too. In the query [Q03](#q03) (see [graphical representation](#q03-graphical-representation)), more precisely, we query for **the anatomical entities where the "APOC1" gene is expressed**.

#### Q03:

> _Question_: What are the anatomical entities where the "APOC1" gene is expressed?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
SELECT DISTINCT ?anat ?anatName {
	?seq a orth:Gene .
	?seq genex:isExpressedIn ?anat .
	?seq rdfs:label "APOC1" .
	?anat a genex:AnatomicalEntity .
	?anat rdfs:label ?anatName .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A%09%3Fseq+genex%3AisExpressedIn+%3Fanat.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fanat+a+genex%3AAnatomicalEntity+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.+%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q03 graphical representation:

![](../img/doc/sparql-tutorial/q03.png#tutoimgborder)

Other vocabulary terms:

- [orth:Gene](https://biosoda.github.io/genex/#http://purl.org/net/orth#Gene): a class representing genes.
- [genex:AnatomicalEntity](https://biosoda.github.io/genex/#AnatomicalEntity): a class representing anatomical entities such as organs.
- [rdfs:label](http://www.w3.org/2000/01/rdf-schema#label): in the Bgee KG, this relation is often used to give names for each individual of a class.

### Where is a human gene expressed? (simplified)

Similarly to the previous query, we can specify the species from where the gene comes from to avoid possible ambiguities among gene names in different species. In the query [Q04](#q04) (see its [graphical representation](#q04-graphical-representation)), more precisely, we query for **the anatomical entities where the "APOC1" Homo sapiens gene is expressed**.

#### Q04:

> _Question_: What are the anatomical entities where the "APOC1" Homo sapiens gene is expressed?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>

SELECT DISTINCT ?anat ?anatName {
	?seq a orth:Gene .
	?seq genex:isExpressedIn ?anat .
	?seq rdfs:label "APOC1" .
	?anat a genex:AnatomicalEntity .
	?anat rdfs:label ?anatName .
	### Specifying species:
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 ?species . #in taxon
	?species a up:Taxon .
	?species up:scientificName "Homo sapiens" .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A%09%3Fseq+genex%3AisExpressedIn+%3Fanat.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fanat+a+genex%3AAnatomicalEntity+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.+%0D%0A++++%23%23%23Specifies+species%3A%0D%0A++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++%3Forganism+obo%3ARO_0002162++%3Fspecies+.+%23in+taxon%0D%0A++++%3Fspecies+a+up%3ATaxon+.%0D%0A++++%3Fspecies+up%3AscientificName+%22Homo+sapiens%22+.%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q04 graphical representation:

![](../img/doc/sparql-tutorial/q04.png#tutoimgborder)

> **NOTE**: [orth:organism](https://biosoda.github.io/genex/#http://purl.org/net/orth#organism) (a relation to assign an organism to a gene) chained with [obo:RO_0002162](https://biosoda.github.io/genex/#http://purl.obolibrary.org/obo/RO_0002162) (a relation to assign a taxon to an organism) indicates from which taxon a gene belongs.

### Where is a gene expressed? (with more details)

In addition to anatomical entities, many conditions can be specified with [genex:isExpressedIn](https://biosoda.github.io/genex/#isExpressedIn) property. This property can relate a gene to several gene expression conditions defined with the [genex:ExpressionCondition](https://biosoda.github.io/genex/#ExpressionCondition) class. That is, in what conditions the gene is considered expressed such as below:

- An anatomical entity ([genex:AnatomicalEntity](https://biosoda.github.io/genex/#AnatomicalEntity))
- A developmental stage ([genex:DevelopmentalStage](https://biosoda.github.io/genex/#http://www.ebi.ac.uk/efo/EFO_0000399))
- A sex (as text values, i.e.: `"any"`, `"NA"`, `"female"`, `"hermaphrodite"`, `"male"`, `"mixed"`, `"not annotated"`)
- A strain ([efo:EFO_0005135](https://biosoda.github.io/genex/#http://www.ebi.ac.uk/efo/EFO_0005135)).

The query [Q05](#q05) (see its [graphical representation](#q05-graphical-representation)) retrieves the same results as [Q03](#q03), but it is more accurate because it explicitly specifies the results are independent of developmental stage, sex, strain, and cell type.

#### Q05:

> _Question_: What are the anatomical entities where the "APOC1" gene is expressed independently of the developmental stage, sex, strain, and cell type?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>

SELECT DISTINCT ?anat ?anatName {
	?seq a orth:Gene .
	?seq genex:isExpressedIn ?condition .
	?seq rdfs:label "APOC1" .
	?condition genex:hasAnatomicalEntity ?anat .
	?condition genex:hasAnatomicalEntity obo:GO_0005575 .
	?anat rdfs:label ?anatName .
	?condition genex:hasDevelopmentalStage ?stage .
	?stage rdfs:label "life cycle" .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A%09%3Fseq+genex%3AisExpressedIn+%3Fcondition.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A+++%09%3Fcondition+genex%3AhasAnatomicalEntity+obo%3AGO_0005575+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.+%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+%3Fstage+.%0D%0A%09%3Fstage+rdfs%3Alabel+%22life+cycle%22+.%0D%0A++%09%3Fcondition+genex%3AhasSex+%22any%22.%0D%0A+++%09%3Fcondition+genex%3AhasStrain+%3Fstrain+.%0D%0A++++++++%3Fstrain+rdfs%3Alabel+%22wild-type%22+.%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

Other vocabulary terms:

- [genex:hasAnatomicalEntity](https://biosoda.github.io/genex/#hasExpressionCondition): this relation states in which anatomical entity a gene expression is being assessed.
- [genex:hasDevelopmentalStage](https://biosoda.github.io/genex/#hasDevelopmentalStage): this relation states during which developmental stage a gene expression is being assessed.
- [genex:hasSex](https://biosoda.github.io/genex/#hasSex): this relation states in which sex a gene expression is being assessed.
- [genex:hasStrain](https://biosoda.github.io/genex/#hasStrain): this relation states in which strain a gene expression is being assessed.

#### Q05 graphical representation:

![](../img/doc/sparql-tutorial/q05.png#tutoimgborder)

These query triple patterns are more accurate because we can now precisely define the other expression conditions available instead of only an anatomical entity.

### In what cell types is a gene expressed?

When defining the condition to assess a gene expression, the [genex:hasAnatomicalEntity](https://biosoda.github.io/genex/#hasAnatomicalEntity) property is used to state cell types too since a cell type is also considered as an anatomical entity. For example, to define that a gene is expressed in the lung, the graph below is built where we can interpret that the gene is expressed in a cellular component located in the lung, in other words, in the lung. Therefore, when the cell type is unspecified, we assert with `genex:hasAnatomicalEntity` property the value [obo:GO_0005575 (cellular_component)](http://purl.obolibrary.org/obo/GO_0005575), this [Gene Ontology](https://geneontology.org/) term is the root of all cell types.

![](../img/doc/sparql-tutorial/cell-type.png#tutoimgborder)

Below, we show a question and its corresponding SPARQL query [Q06](#q06) along with its [graph representation](#q06-graphical-representation) where other gene expression conditions are specified, more precisely, the developmental stage.

#### Q06:

> _Question_: What are the anatomical entities where the human gene "APOC1" is expressed in the post-juvenile stage?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>

SELECT DISTINCT ?anat ?anatName ?stage {
	?seq a orth:Gene .
	?seq genex:isExpressedIn ?condition .
	?seq rdfs:label "APOC1" .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasAnatomicalEntity obo:GO_0005575 .
	?condition genex:hasDevelopmentalStage ?stage .
	?stage rdfs:label "post-juvenile" .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 ?species . #in taxon
	?species a up:Taxon .
	?species up:commonName "human" .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%3Fstage+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A%09%3Fseq+genex%3AisExpressedIn+%3Fcondition.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.+%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+%3Fstage+.%0D%0A%09%3Fstage+rdfs%3Alabel+%22post-juvenile%22+.%0D%0A++++++++%23%23%23+Specifying+the+species%3A%0D%0A++++++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++++++%3Forganism+obo%3ARO_0002162++%3Fspecies+.+%23in+taxon%0D%0A++++++++%3Fspecies+a+up%3ATaxon+.%0D%0A++++++++%3Fspecies+up%3AcommonName+%22human%22+.%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q06 graphical representation:

![](../img/doc/sparql-tutorial/q06.png#tutoimgborder)

Moreover, if there is not a specific strain to declare, the strain must be defined as "wild-type" since "wild-type" represents any strain. This is because Bgee only considers wild-type experiments. As a result, we ensure the gene is expressed independently of the strain type. If we do not state that is a "wild-type" strain, expressed genes that are exclusive to a specific strain will be considered too. Similarly, for sex, if stated as 'any', it means that the gene is expressed in any sex type.

> **NOTE:** Currently, the data accessible via the SPARQL endpoint do not specify _sex_ and _strain_ types. Therefore, to optimize this query, we can omit triple patterns related to sex and strain. [Q07](#q07) is the optimized SPARQL query that retrieves exactly the same results as [Q06](#q06).

#### Q07:

> _Question_: What are the anatomical entities where the human gene "APOC1" is expressed in the post-juvenile stage?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>

SELECT DISTINCT ?anat ?anatName ?stage {
	?seq a orth:Gene .
	?seq genex:isExpressedIn ?condition .
	?seq rdfs:label "APOC1" .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasAnatomicalEntity obo:GO_0005575 .
	?condition genex:hasDevelopmentalStage ?stage .
	?stage rdfs:label "post-juvenile" .
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 ?species . #in taxon
	?species a up:Taxon .
	?species up:commonName "human" .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%3Fstage+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A%09%3Fseq+genex%3AisExpressedIn+%3Fcondition.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.%0D%0A++++%3Fcondition+genex%3AhasAnatomicalEntity+obo%3AGO_0005575+.%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+%3Fstage+.%0D%0A%09%3Fstage+rdfs%3Alabel+%22post-juvenile%22+.%0D%0A++++++++%23%23%23+Specifying+the+species%3A%0D%0A++++++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++++++%3Forganism+obo%3ARO_0002162++%3Fspecies+.+%23in+taxon%0D%0A++++++++%3Fspecies+a+up%3ATaxon+.%0D%0A++++++++%3Fspecies+up%3AcommonName+%22human%22+.%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

### Where is a gene expressed and its expression score?

Expression of genes and their corresponding scores can also be obtained via the [genex:Expression](https://biosoda.github.io/genex/#Expression) concept. We rewrite the query [Q07](#q07) using the `genex:Expression` concept.

The query [Q08](#q08) below (see its [graphical representation](#q08-graphical-representation)) retrieves **anatomical entities where the human gene "APOC1" is expressed in the post-juvenile stage along with its expression score independently of the strain, sex, and cell type**. The higher the expression score is, the higher the gene is expressed considering a given experimental condition. Note that the query [Q08](#q08) orders results by expression scores with the statement: `ORDER BY DESC(?score)` where `DESC()` is an ordering modifier indicating the descending order.

#### Q08:

> _Question_: What are the anatomical entities where the human gene "APOC1" is expressed in the post-juvenile stage along with its expression score independently of the strain, sex, and cell type?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>

SELECT DISTINCT ?anat ?anatName ?score ?stage {
	?seq a orth:Gene .
	?expression a genex:Expression .
	?expression genex:hasExpressionCondition ?condition .
	?expression genex:hasExpressionLevel ?score .
	?expression genex:hasSequenceUnit ?seq .
	?seq rdfs:label "APOC1" .
	?condition genex:hasAnatomicalEntity ?anat .
	?condition genex:hasAnatomicalEntity obo:GO_0005575 .
	?anat rdfs:label ?anatName .
	?condition genex:hasDevelopmentalStage ?stage .
	?stage rdfs:label "post-juvenile" .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 ?species . #in taxon
	?species a up:Taxon .
	?species up:commonName "human" .
FILTER (?anat != obo:GO_0005575)
} ORDER BY DESC(?score)
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%3Fscore+%3Fstage+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A++++++++%3Fexpression+a+genex%3AExpression+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionCondition+%3Fcondition+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionLevel+%3Fscore+.%0D%0A%09%3Fexpression+genex%3AhasSequenceUnit+%3Fseq+.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.+%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+%3Fstage+.%0D%0A%09%3Fstage+rdfs%3Alabel+%22post-juvenile%22+.%0D%0A++%09%23%3Fcondition+genex%3AhasSex+%22any%22.%0D%0A+++%09%23%3Fcondition+genex%3AhasStrain+%3Fstrain+.%0D%0A++++++++%23%3Fstrain+rdfs%3Alabel+%22wild-type%22+.%0D%0A++++++++%23%23%23+Specifying+the+species%3A%0D%0A++++++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++++++%3Forganism+obo%3ARO_0002162++%3Fspecies+.+%23in+taxon%0D%0A++++++++%3Fspecies+a+up%3ATaxon+.%0D%0A++++++++%3Fspecies+up%3AcommonName+%22human%22+.%0D%0AFILTER+%28%3Fanat+%21%3D++obo%3AGO_0005575%29%0D%0A%7D+ORDER+BY+DESC%28%3Fscore%29&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q08 graphical representation:

![](../img/doc/sparql-tutorial/q08.png#tutoimgborder)

> **NOTE:** In the query [Q08](#q08), we filter out the anatomical entity `obo:GO_0005575` that is "cellular_component" with the expression `FILTER(?anat != obo:GO_0005575)` because it is not informative. In other words, "cellular_component" means any cell type.

> **NOTE:** In [Q08](#q08), we define the cell type where the gene expression is being evaluated as the most general (i.e., the root term `obo:GO_0005575`) with the statement `?condition genex:hasAnatomicalEntity obo:GO_0005575 .`. The cost of doing this is that the query will not return specific cell level expression.

The query [Q09](#q09) eliminates the ambiguities of genes that are not only stated as expressed in a given organ or tissue, but also in a specific cell type in the same tissue or organ, however with different expression scores. Note that this specific cell is a subtype of the "cellular_component" ([obo:GO_0005575](http://purl.obolibrary.org/obo/GO_0005575)).
Therefore, the query [Q09](#q09) below also retrieves gene expression calls related to specific cell types different from "cellular_component". [Q09](#q09) query can be interpreted as **anatomical entities including cell types, if any, where the human gene "APOC1" is expressed at the post-juvenile stage along with its expression score independently of the strain and sex**.

#### Q09:

> _Question_: What are the anatomical entities including cell types, if any, where the human gene "APOC1" is expressed at the post-juvenile stage along with its expression score independently of the strain and sex?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>

SELECT DISTINCT ?anat ?cellType ?anatName ?cellTypeName ?score ?stage {
	?seq a orth:Gene .
	?expression a genex:Expression .
	?expression genex:hasExpressionCondition ?condition .
	?expression genex:hasExpressionLevel ?score .
	?expression genex:hasSequenceUnit ?seq .
	?seq rdfs:label "APOC1" .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasAnatomicalEntity ?cellType .
	?cellType rdfs:label ?cellTypeName .
	?condition genex:hasDevelopmentalStage ?stage .
	?stage rdfs:label "post-juvenile" .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 ?species . #in taxon
	?species a up:Taxon .
	?species up:commonName "human" .
FILTER (?anat != obo:GO_0005575)
FILTER (?anat != ?cellType)
} ORDER BY DESC(?score)
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FcellType+%3FanatName+%3FcellTypeName+%3Fscore+%3Fstage+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A++++++++%3Fexpression+a+genex%3AExpression+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionCondition+%3Fcondition+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionLevel+%3Fscore+.%0D%0A%09%3Fexpression+genex%3AhasSequenceUnit+%3Fseq+.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A++++%3Fanat+rdfs%3Alabel+%3FanatName+.%0D%0A+++%09%3Fcondition+genex%3AhasAnatomicalEntity+%3FcellType+.%0D%0A++++%3FcellType+rdfs%3Alabel+%3FcellTypeName+.%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+%3Fstage+.%0D%0A%09%3Fstage+rdfs%3Alabel+%22post-juvenile%22+.%0D%0A++%09%3Fcondition+genex%3AhasSex+%22any%22.%0D%0A+++%09%3Fcondition+genex%3AhasStrain+%3Fstrain+.%0D%0A++++++++%3Fstrain+rdfs%3Alabel+%22wild-type%22+.%0D%0A++++++++%23%23%23+Specifying+the+species%3A%0D%0A++++++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++++++%3Forganism+obo%3ARO_0002162++%3Fspecies+.+%23in+taxon%0D%0A++++++++%3Fspecies+a+up%3ATaxon+.%0D%0A++++++++%3Fspecies+up%3AcommonName+%22human%22+.%0D%0AFILTER+%28%3Fanat+%21%3D++obo%3AGO_0005575%29%0D%0AFILTER+%28%3Fanat+%21%3D+%3FcellType%29%0D%0A%7D+ORDER+BY+DESC%28%3Fscore%29&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q09 graphical representation:

![](../img/doc/sparql-tutorial/q09.png#tutoimgborder)

> **NOTE:** Currently, the data accessible via the SPARQL endpoint do not specify _sex_ and _strain_ types. Therefore, to optimize [Q09](#q09) query, we can omit triple patterns related to sex and strain. [Q10](#q10) is the optimized SPARQL query that retrieves exactly the same results as [Q09](#q09).

#### Q10:

> _Question_: What are the anatomical entities including cell types, if any, where the human gene "APOC1" is expressed at the post-juvenile stage along with its expression score independently of the strain and sex?
> _SPARQL query ([Q09](#q09) optimised)_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>

SELECT DISTINCT ?anat ?cellType ?anatName ?cellTypeName ?score ?stage {
	?seq a orth:Gene .
	?expression a genex:Expression .
	?expression genex:hasExpressionCondition ?condition .
	?expression genex:hasExpressionLevel ?score .
	?expression genex:hasSequenceUnit ?seq .
	?seq rdfs:label "APOC1" .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasAnatomicalEntity ?cellType .
	?cellType rdfs:label ?cellTypeName .
	?condition genex:hasDevelopmentalStage ?stage .
	?stage rdfs:label "post-juvenile" .
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 ?species . #in taxon
	?species a up:Taxon .
	?species up:commonName "human" .
FILTER (?anat != obo:GO_0005575)
FILTER (?anat != ?cellType)
} ORDER BY DESC(?score)
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FcellType+%3FanatName+%3FcellTypeName+%3Fscore+%3Fstage+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A++++++++%3Fexpression+a+genex%3AExpression+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionCondition+%3Fcondition+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionLevel+%3Fscore+.%0D%0A%09%3Fexpression+genex%3AhasSequenceUnit+%3Fseq+.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A++++++++%3Fanat+rdfs%3Alabel+%3FanatName+.%0D%0A+++%09%3Fcondition+genex%3AhasAnatomicalEntity+%3FcellType+.%0D%0A++++++++%3FcellType+rdfs%3Alabel+%3FcellTypeName+.%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+%3Fstage+.%0D%0A%09%3Fstage+rdfs%3Alabel+%22post-juvenile%22+.%0D%0A++++++++%23%23%23+Specifying+the+species%3A%0D%0A++++++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++++++%3Forganism+obo%3ARO_0002162++%3Fspecies+.+%23in+taxon%0D%0A++++++++%3Fspecies+a+up%3ATaxon+.%0D%0A++++++++%3Fspecies+up%3AcommonName+%22human%22+.%0D%0AFILTER+%28%3Fanat+%21%3D++obo%3AGO_0005575%29%0D%0AFILTER+%28%3Fanat+%21%3D+%3FcellType%29%0D%0A%7D+ORDER+BY+DESC%28%3Fscore%29&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

## Querying with controlled vocabularies and identifiers

Queries specifying conditions such as taxa, anatomical entities, and developmental stages can be written with their corresponding controlled vocabularies and represented as IRIs - Internationalized Resource Identifier (e.g., Web addresses).

### Taxonomy identifiers

Taxa are based on the NCBI taxonomy identifiers, to find out the NCBI ID that corresponds to the species being looked for, you can choose the species at [https://www.bgee.org/search/species](https://www.bgee.org/search/species) and look for the species ID in the general information section. Alternatively, we can search the NCBI ID of a given species directly at the [NCBI taxonomy website](https://www.ncbi.nlm.nih.gov/taxonomy). For example, human ID is `9606`, and its full corresponding IRI defined in the Bgee knowledge graph is `http://purl.uniprot.org/taxonomy/9606`. More precisely, the full IRI is composed of the `http://purl.uniprot.org/taxonomy/` prefix and the NCBI ID as the suffix.

### Gene identifiers

Currently, Bgee mostly reuses either Ensembl or NCBI Gene database identifiers depending on the genome source. These identifiers are stated for each gene with the [dcterms:identifier](http://purl.org/dc/terms/identifier) relation. The genome source for each species in Bgee can be verified at each Bgee species page accessible at [https://www.bgee.org/search/species](https://www.bgee.org/search/species) such as [human page](https://www.bgee.org/species/9606) states the genome source as being [Ensembl](https://oct2024.archive.ensembl.org/Homo_sapiens/Info/Index) in the "General information" section. To fetch the corresponding main gene identifier to a given gene in Bgee, we can rely on the [Bgee's gene search tool](https://www.bgee.org/search/genes). For example, if we search for the APOC1 gene with the [Bgee's gene search tool](https://www.bgee.org/search/genes), the first row result refers to the human APOC1 gene and the first column shows the corresponding Ensembl id: `ENSG00000130208` and its full IRI is `http://rdf.ebi.ac.uk/resource/ensembl/ENSG00000130208` as defined in the Bgee knowledge graph. The IRI is composed of the prefix `http://rdf.ebi.ac.uk/resource/ensembl/` and the `Ensembl id`. If it is a `NCBI Gene id`, the IRI prefix is `https://www.ncbi.nlm.nih.gov/gene/`. For instance, `https://www.ncbi.nlm.nih.gov/gene/118230125` corresponds to the [apoc1 eel gene](https://www.ncbi.nlm.nih.gov/gene/118230125).

### Anatomical entity vocabulary

For looking up an ontology term corresponding to a given anatomical entity, we can rely on the Ontology Look Up service at https://www.ebi.ac.uk/ols4/ontologies/uberon. For example, if we type `liver` in the search field we can retrieve the Uberon identifier that is `UBERON:0002107` and its corresponding IRI http://purl.obolibrary.org/obo/UBERON_0002107 as defined in the Bgee knowledge graph.

### Developmental stage vocabulary

For looking up an ontology term corresponding to a given developmental stage, we can browse the [developmental stage file](https://raw.githubusercontent.com/BgeeDB/bgee_pipeline/master/source_files/uberon/dev_stage_ontology.obo). In this file, by looking at the name and ID fields we can compose the corresponding IRI of a given developmental stage. For example, we can look up `post-juvenile` and find out that its ID is `UBERON:0000113`. By prefixing this ID with `http://purl.obolibrary.org/obo/` and replacing `:` with `_`, we can define its IRI as stated in the Bgee knowledge graph: `http://purl.obolibrary.org/obo/UBERON_0000113`.
Alternatively, we can retrieve all developmental stages and their IRIs in Bgee with the [Q11 query](#q11).

#### Q11:

> _Question_: What are the developmental stages present in Bgee?
> _SPARQL query_:

```
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX efo: <http://www.ebi.ac.uk/efo/>

SELECT DISTINCT ?stage ?stageName ?stageDescription {
	?stage rdf:type efo:EFO_0000399 . #developmental stage
	?stage rdfs:label ?stageName .
	?stage dcterms:description ?stageDescription .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+dcterms%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+efo%3A+%3Chttp%3A%2F%2Fwww.ebi.ac.uk%2Fefo%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fstage+%3FstageName+%3FstageDescription+%7B%0D%0A%09%3Fstage+rdf%3Atype+efo%3AEFO_0000399+.%0D%0A++++++++%3Fstage+rdfs%3Alabel+%3FstageName+.+%0D%0A++++++++%3Fstage+dcterms%3Adescription+%3FstageDescription+.+%0D%0A%7D+&should-sponge=&format=text%2Fhtml&timeout=0&debug=on)

In Q11 query, we can also apply a filter by adding the statement `FILTER (CONTAINS(?stageName,"stage"))` and replacing `"stage"` with the stage name or part of its name we are searching for such as the following:`FILTER (CONTAINS(?stageName,"post-juvenile"))` where the function CONTAINS checks if the "post-juvenile" string is a substring of any stage name in Bgee. [Q11-a](#q11-a) implements this filter.

#### Q11-a:

> _Question_: What is the post-juvenile stage link and description?
> _SPARQL query_:

```
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX efo: <http://www.ebi.ac.uk/efo/>

SELECT DISTINCT ?stage ?stageName ?stageDescription {
	?stage rdf:type efo:EFO_0000399 . #developmental stage
	?stage rdfs:label ?stageName .
	?stage dcterms:description ?stageDescription .
	FILTER (CONTAINS(?stageName,"post-juvenile"))
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+dcterms%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX+efo%3A+%3Chttp%3A%2F%2Fwww.ebi.ac.uk%2Fefo%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fstage+%3FstageName+%3FstageDescription+%7B%0D%0A%09%3Fstage+rdf%3Atype+efo%3AEFO_0000399+.%0D%0A++++++++%3Fstage+rdfs%3Alabel+%3FstageName+.+%0D%0A++++++++%3Fstage+dcterms%3Adescription+%3FstageDescription+.+%0D%0AFILTER+%28CONTAINS%28%3FstageName%2C%22post-juvenile%22%29%29%0D%0A%7D+&should-sponge=&format=text%2Fhtml&timeout=0&debug=on)

### Example 1: querying with controlled vocabularies

Let us consider the question addressed by the [Q08](#q08) query: **anatomical entities where the human gene "APOC1" is expressed at the post-juvenile stage along with its expression score independently of the strain, sex, and cell type**.
We can rewrite the [Q08](#q08) query as shown in [Q08-a](#q08-a) (see its [graphical representation](#q08-a-graphical-representation)) below, where:

- [obo:UBERON_0000113](http://purl.obolibrary.org/obo/UBERON_0000113) represents the `post-juvenile` stage
- the taxon [up-taxon:9606](http://purl.uniprot.org/taxonomy/9606) represents `human` - the `APOC1` gene is defined with [ensembl:ENSG00000130208](https://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=ENSG00000130208;r=19:44914247-44919349) that is an IRI composed of the Ensembl gene identifier.
- all prefixes (`obo:`, `ensembl:` and `up-taxon:`) are defined in [Q08-a](#q08-a) query header. Moreover, the full IRI can also be provided in the query by defining it between `<>`, for instance, `<http://purl.uniprot.org/taxonomy/9606>` is the same as `up-taxon:9606` as defined in the [Q08-a](#q08-a) query.

#### Q08-a:

> _Question_: What are the anatomical entities where the human gene "APOC1" is expressed at the post-juvenile stage along with its expression score independently of the strain, sex, and cell type?
> _SPARQL query (a [Q08](#q08) variant)_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX up-taxon:<http://purl.uniprot.org/taxonomy/>
PREFIX ensembl: <http://rdf.ebi.ac.uk/resource/ensembl/>
PREFIX lscr: <http://purl.org/lscr#>

SELECT DISTINCT ?anat ?anatName ?score {
	?seq a orth:Gene .
	?expression a genex:Expression .
	?expression genex:hasExpressionCondition ?condition .
	?expression genex:hasExpressionLevel ?score .
	?expression genex:hasSequenceUnit ?seq .
	?seq lscr:xrefEnsemblGene ensembl:ENSG00000130208 .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasDevelopmentalStage obo:UBERON_0000113 .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 up-taxon:9606 .
FILTER (?anat != obo:GO_0005575)
} ORDER BY DESC(?score)
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0APREFIX+up-taxon%3A%3Chttp%3A%2F%2Fpurl.uniprot.org%2Ftaxonomy%2F%3E%0D%0APREFIX+ensembl%3A+%3Chttp%3A%2F%2Frdf.ebi.ac.uk%2Fresource%2Fensembl%2F%3E%0D%0APREFIX+lscr%3A+%3Chttp%3A%2F%2Fpurl.org%2Flscr%23%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%3Fscore++%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A++++++++%3Fexpression+a+genex%3AExpression+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionCondition+%3Fcondition+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionLevel+%3Fscore+.%0D%0A%09%3Fexpression+genex%3AhasSequenceUnit+%3Fseq+.%0D%0A++++++++%3Fseq+lscr%3AxrefEnsemblGene+ensembl%3AENSG00000130208+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A++++++++%3Fanat+rdfs%3Alabel+%3FanatName+.%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+obo%3AUBERON_0000113+.%0D%0A++%09%3Fcondition+genex%3AhasSex+%22any%22.%0D%0A+++%09%3Fcondition+genex%3AhasStrain+%3Fstrain+.%0D%0A++++++++%3Fstrain+rdfs%3Alabel+%22wild-type%22+.%0D%0A++++++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++++++%3Forganism+obo%3ARO_0002162++up-taxon%3A9606+.%0D%0AFILTER+%28%3Fanat+%21%3D++obo%3AGO_0005575%29%0D%0A%7D+ORDER+BY+DESC%28%3Fscore%29&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q08-a graphical representation:

![](../img/doc/sparql-tutorial/q08-a.png#tutoimgborder)

The [Q08-a](#q08-a) query can be further simplified by removing the statements about species because an Ensembl gene identifier is always associated with a unique species, hence, by stating `ensembl:ENSG00000130208`, we are already referring to a human gene. This simplified version is shown in [Q08-b](#q08-b) query.

#### Q08-b:

> _Question_: What are the anatomical entities where the human gene "APOC1" is expressed at the post-juvenile stage along with its expression score independently of the strain, sex, and cell type?
> _SPARQL query (a [Q08](#q08) variant)_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX up-taxon:<http://purl.uniprot.org/taxonomy/>
PREFIX ensembl: <http://rdf.ebi.ac.uk/resource/ensembl/>
PREFIX lscr: <http://purl.org/lscr#>

SELECT DISTINCT ?anat ?anatName ?score {
	?seq a orth:Gene .
	?expression a genex:Expression .
	?expression genex:hasExpressionCondition ?condition .
	?expression genex:hasExpressionLevel ?score .
	?expression genex:hasSequenceUnit ?seq .
	?seq lscr:xrefEnsemblGene ensembl:ENSG00000130208 .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasDevelopmentalStage obo:UBERON_0000113 .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
FILTER (?anat != obo:GO_0005575)
} ORDER BY DESC(?score)
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0APREFIX+up-taxon%3A%3Chttp%3A%2F%2Fpurl.uniprot.org%2Ftaxonomy%2F%3E%0D%0APREFIX+ensembl%3A+%3Chttp%3A%2F%2Frdf.ebi.ac.uk%2Fresource%2Fensembl%2F%3E%0D%0APREFIX+lscr%3A+%3Chttp%3A%2F%2Fpurl.org%2Flscr%23%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%3Fscore++%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A++++++++%3Fexpression+a+genex%3AExpression+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionCondition+%3Fcondition+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionLevel+%3Fscore+.%0D%0A%09%3Fexpression+genex%3AhasSequenceUnit+%3Fseq+.%0D%0A++++++++%3Fseq+lscr%3AxrefEnsemblGene+ensembl%3AENSG00000130208+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A++++++++%3Fanat+rdfs%3Alabel+%3FanatName+.%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+obo%3AUBERON_0000113+.%0D%0A++%09%3Fcondition+genex%3AhasSex+%22any%22.%0D%0A+++%09%3Fcondition+genex%3AhasStrain+%3Fstrain+.%0D%0A++++++++%3Fstrain+rdfs%3Alabel+%22wild-type%22+.%0D%0AFILTER+%28%3Fanat+%21%3D++obo%3AGO_0005575%29%0D%0A%7D+ORDER+BY+DESC%28%3Fscore%29&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

### Example 2: querying with gene source identifiers

To query gene expression information of a species where the genome source is NCBI such as the example of the apoc1 eel gene (see [Gene identifiers](#gene-identifiers)), one way is to use the `lscr:xrefNCBIGene` property. For example, to answer the [Q12](#q12) question, we can consider [Q08-b](#q08-b) and replace the relation `lscr:xrefEnsemblGene` that relates a Bgee gene to its corresponding Ensembl gene IRI with `lscr:xrefNCBIGene` in the statement:
`?seq lscr:xrefEnsemblGene ensembl:ENSG00000130208 .` . `ensembl:ENSG00000130208` should also be replaced with the apoc1 eel gene IRI from NCBI Gene database: `<https://www.ncbi.nlm.nih.gov/gene/118230125>`.

#### Q12:

> _Question_: What are the anatomical entities where the eel gene "apoc1" is expressed along with its expression score independently of the strain, sex, and cell type?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX up-taxon:<http://purl.uniprot.org/taxonomy/>
PREFIX lscr: <http://purl.org/lscr#>

SELECT DISTINCT ?anat ?anatName ?stageIRI ?score {
	?seq a orth:Gene .
	?expression a genex:Expression .
	?expression genex:hasExpressionCondition ?condition .
	?expression genex:hasExpressionLevel ?score .
	?expression genex:hasSequenceUnit ?seq .
	?seq lscr:xrefNCBIGene <https://www.ncbi.nlm.nih.gov/gene/118230125> .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasDevelopmentalStage ?stageIRI .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
FILTER (?anat != obo:GO_0005575)
} ORDER BY DESC(?score)
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0APREFIX+up-taxon%3A%3Chttp%3A%2F%2Fpurl.uniprot.org%2Ftaxonomy%2F%3E%0D%0APREFIX+lscr%3A+%3Chttp%3A%2F%2Fpurl.org%2Flscr%23%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%3FstageIRI+%3Fscore++%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A++++++++%3Fexpression+a+genex%3AExpression+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionCondition+%3Fcondition+.%0D%0A++++++++%3Fexpression+genex%3AhasExpressionLevel+%3Fscore+.%0D%0A%09%3Fexpression+genex%3AhasSequenceUnit+%3Fseq+.%0D%0A++++++++%3Fseq+lscr%3AxrefNCBIGene+%3Chttps%3A%2F%2Fwww.ncbi.nlm.nih.gov%2Fgene%2F118230125%3E+.%0D%0A%09%3Fcondition+genex%3AhasAnatomicalEntity+%3Fanat+.%0D%0A++++++++%3Fanat+rdfs%3Alabel+%3FanatName+.%0D%0A++++++++%3Fcondition+genex%3AhasDevelopmentalStage+%3FstageIRI+.%0D%0A++%09%3Fcondition+genex%3AhasSex+%22any%22.%0D%0A+++%09%3Fcondition+genex%3AhasStrain+%3Fstrain+.%0D%0A++++++++%3Fstrain+rdfs%3Alabel+%22wild-type%22+.%0D%0AFILTER+%28%3Fanat+%21%3D++obo%3AGO_0005575%29%0D%0A%7D+ORDER+BY+DESC%28%3Fscore%29&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

Note that in the [Q12](#q12) question a specific developmental stage is not declared. So, because it is unknown or not specified, we replaced `obo:UBERON_0000113` in [Q08-b](#q08-b) with a variable (`?stageIRI`) and we projected it in the `SELECT` query header to properly answer the [Q12](#q12) question. Moreover, if we want to generalize the [Q12](#q12) query for any genome source, we could replace the property `lscr:xrefNCBIGene` with a variable (e.g., `?xref_property`). Alternatively, we can use the [dcterms:identifier](http://purl.org/dc/terms/identifier) property that assigns an identifier for each Bgee gene according to the gene identifier of the genome source of a given species in Bgee. See [Q12-a](#q12-a) which retrieves exactly the same results as [Q12](#q12) but by using the `dcterms:identifier` relation. For a graphical representation of [Q12-a](#q12-a) see [Q12-a graphical representation](#q12-a-graphical-representation).

#### Q12-a:

> _Question_: What are the anatomical entities where the eel gene "apoc1" is expressed along with its expression score independently of the strain, sex, and cell type?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>
PREFIX up-taxon:<http://purl.uniprot.org/taxonomy/>
PREFIX lscr: <http://purl.org/lscr#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT ?anat ?anatName ?stageIRI ?score {
	?seq a orth:Gene .
	?expression a genex:Expression .
	?expression genex:hasExpressionCondition ?condition .
	?expression genex:hasExpressionLevel ?score .
	?expression genex:hasSequenceUnit ?seq .
	?seq dcterms:identifier "118230125" .
	?condition genex:hasAnatomicalEntity ?anat .
	?anat rdfs:label ?anatName .
	?condition genex:hasDevelopmentalStage ?stageIRI .
	?condition genex:hasSex "any" .
	?condition genex:hasStrain ?strain .
	?strain rdfs:label "wild-type" .
FILTER (?anat != obo:GO_0005575)
} ORDER BY DESC(?score)
```

#### Q12-a graphical representation:

![](../img/doc/sparql-tutorial/q12-a.png#tutoimgborder)

## Querying with UniProtKB cross-references

To query with UniProtKB cross-references the easiest way is to state the property `lscr:xrefUniprot` that is assigned to each Bgee gene. For example, the human APOC1 gene has its corresponding UniProtKB IRI `up-protein:P02654` where `up-protein:` is a prefix replacing the URI `http://purl.uniprot.org/uniprot/` as defined in the header of the [Q13](#q13).

[Q13](#q13) retrieves the same results, and it is similar to [Q03](#q03) but [Q13](#q13) uses UniProtKB accession numbers for identifying genes instead of gene names or symbols, in other words, it uses `lscr:xrefUniprot` instead of `rdfs:label` property.

#### Q13:

> _Question_: What are the anatomical entities where the P02654 gene is expressed?
> Note that [P02654](http://purl.uniprot.org/uniprot/P02654) is a UniProtKB identifier of the APOC1 human gene.
> _SPARQL query_ (see [Q13 graphical representation](#q13-graphical-representation)):

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up-protein:<http://purl.uniprot.org/uniprot/>
PREFIX lscr: <http://purl.org/lscr#>

SELECT DISTINCT ?anat ?anatName {
	?seq a orth:Gene .
	?seq genex:isExpressedIn ?anat .
	?seq lscr:xrefUniprot up-protein:P02654 .
	?anat a genex:AnatomicalEntity .
	?anat rdfs:label ?anatName .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up-protein%3A%3Chttp%3A%2F%2Fpurl.uniprot.org%2Funiprot%2F%3E%0D%0APREFIX+lscr%3A+%3Chttp%3A%2F%2Fpurl.org%2Flscr%23%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A%09%3Fseq+genex%3AisExpressedIn+%3Fanat+.%0D%0A%09%3Fseq+lscr%3AxrefUniprot+up-protein%3AP02654+.%0D%0A%09%3Fanat+a+genex%3AAnatomicalEntity+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.+%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q13 graphical representation:

![](../img/doc/sparql-tutorial/q13.png#tutoimgborder)

## Querying gene metadata

All direct attributes of a given gene in the Bgee knowledge graph are listed below:

- [rdfs:label](http://www.w3.org/2000/01/rdf-schema#label) (**always present**): the gene symbol.
- [rdfs:seeAlso](http://www.w3.org/2000/01/rdf-schema#seeAlso) (**always present**): additional links, currently, its values are versioned Bgee gene page links, for instance, `https://www.bgee.org/bgee15_0/gene/ENSG00000130208`.
- [dcterms:description](http://purl.org/dc/terms/description) (**always present**): the gene description.
- [dcterms:identifier](http://purl.org/dc/terms/identifier) (**always present**): the gene identifier as defined by the genome source. Currently, it is either an Ensembl or NCBI Gene database ID (e.g., [ENSG00000130208](https://www.bgee.org/gene/ENSG00000130208), [118230125](https://www.bgee.org/gene/118230125)).
- [orth:organism](http://purl.org/net/orth#organism) (**always present**): the values are the Bgee species webpages, for example, [Homo sapiens](https://www.bgee.org/species/9606).
- [lscr:xrefEnsemblGene](http://purl.org/lscr#xrefEnsemblGene) (**optionally present**): the Ensembl cross-references. The values are the Ensembl IRIs from the [EBI RDF platform](https://academic.oup.com/bioinformatics/article/30/9/1338/234645), for example, http://rdf.ebi.ac.uk/resource/ensembl/ENSG00000130208.
- [lscr:xrefNCBIGene](http://purl.org/lscr#xrefNCBIGene) (**optionally present**): the NCBI Gene database cross-references. The values are the NCBI Gene webpages, for example, https://www.ncbi.nlm.nih.gov/gene/118230125.
- [lscr:xrefUniprot](http://purl.org/lscr#xrefUniprot) (**optionally present**): the UniProtKB cross-references. The values are the UniProtKB persistent links, for example, http://purl.uniprot.org/uniprot/P02654.

[Q14](#q14) shows a SPARQL query to retrieve all metadata related to the `ENSG00000130208` Ensembl gene.

#### Q14:

> _Question_: What is all the metadata related to the `ENSG00000130208` gene, where `ENSG00000130208` is the identifier of the "APOC1" human gene.
> _SPARQL query_ (see [Q14 graphical representation](#q14-graphical-representation)):

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX lscr: <http://purl.org/lscr#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT DISTINCT ?symbol ?description ?id
?links ?organism ?uniprot ?ensembl ?ncbi {
	?seq a orth:Gene .
	?seq rdfs:label ?symbol .
	?seq rdfs:seeAlso ?links .
	?seq dcterms:description ?description .
	?seq dcterms:identifier ?id .
	?seq orth:organism ?organism .
	OPTIONAL{ ?seq lscr:xrefUniprot ?uniprot . }
	OPTIONAL{ ?seq lscr:xrefEnsemblGene ?ensembl . }
	OPTIONAL{ ?seq lscr:xrefNCBIGene ?ncbi . }
	FILTER (?id = "ENSG00000130208")
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+lscr%3A+%3Chttp%3A%2F%2Fpurl.org%2Flscr%23%3E%0D%0APREFIX+dcterms%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fsymbol+%3Fdescription+%3Fid+%0D%0A%3Flinks+%3Forganism+%3Funiprot+%3Fensembl+%3Fncbi++%7B%0D%0A++++%3Fseq+a+orth%3AGene+.%0D%0A++++%3Fseq+rdfs%3Alabel+%3Fsymbol+.%0D%0A++++%3Fseq+rdfs%3AseeAlso+%3Flinks+.%0D%0A++++%3Fseq+dcterms%3Adescription+%3Fdescription+.%0D%0A++++%3Fseq+dcterms%3Aidentifier+%3Fid+.%0D%0A++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++OPTIONAL%7B%3Fseq+lscr%3AxrefUniprot+%3Funiprot+.%7D%0D%0A++++OPTIONAL%7B%3Fseq+lscr%3AxrefEnsemblGene+%3Fensembl+.%7D%0D%0A++++OPTIONAL%7B%3Fseq+lscr%3AxrefNCBIGene+%3Fncbi+.%7D%0D%0A++++FILTER+%28%3Fid+%3D+%22ENSG00000130208%22%29%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q14 graphical representation:

![](../img/doc/sparql-tutorial/q14.png#tutoimgborder)

## Querying Genes with Absence of Expression

To check for genes that are not expressed in some condition or tissue, we can use the [genex:isAbsentIn](https://biosoda.github.io/genex/#isAbsentIn) and [genex:AbsenceExpression](https://biosoda.github.io/genex/#AbsenceExpression) terms instead of [genex:isExpressedIn](https://biosoda.github.io/genex/#isExpressedIn) and [genex:Expression](https://biosoda.github.io/genex/#Expression), respectively. For instance, to answer the question _Where is a gene not expressed?_, we can answer this question by replacing the statement `genex:isExpressedIn` with `genex:isAbsentIn` in the query [Q14](#q14) as shown in [Q15](#q15) and its [graphical representation](#q15-graphical-representation).

#### Q15:

> _Question_: What are the anatomical entities where the "APOC1" Homo sapiens gene is not expressed, that is where is "APOC1" absent?
> _SPARQL query_:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
PREFIX up: <http://purl.uniprot.org/core/>

SELECT DISTINCT ?anat ?anatName {
	?seq a orth:Gene .
	?seq genex:isAbsentIn ?anat .
	?seq rdfs:label "APOC1" .
	?anat a genex:AnatomicalEntity .
	?anat rdfs:label ?anatName .
	?seq orth:organism ?organism .
	?organism obo:RO_0002162 ?species . #in taxon
	?species a up:Taxon .
	?species up:scientificName "Homo sapiens" .
}
```

> To run this query [click here](https://bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fanat+%3FanatName+%7B%0D%0A%09%3Fseq+a+orth%3AGene+.%0D%0A%09%3Fseq+genex%3AisAbsentIn+%3Fanat.%0D%0A%09%3Fseq+rdfs%3Alabel+%22APOC1%22+.%0D%0A%09%3Fanat+a+genex%3AAnatomicalEntity+.%0D%0A%09%3Fanat+rdfs%3Alabel+%3FanatName+.+%0D%0A++++++++%3Fseq+orth%3Aorganism+%3Forganism+.%0D%0A++++++++%3Forganism+obo%3ARO_0002162++%3Fspecies+.+%23in+taxon%0D%0A++++++++%3Fspecies+a+up%3ATaxon+.%0D%0A++++++++%3Fspecies+up%3AscientificName+%22Homo+sapiens%22+.%0D%0A%7D&should-sponge=&format=text%2Fhtml&timeout=0&debug=on).

#### Q15 graphical representation:

![](../img/doc/sparql-tutorial/q15.png#tutoimgborder)

## Programmatic access to the latest version of the Bgee SPARQL endpoint

The latest version of the Bgee SPARQL endpoint is accessible by using your preferred programming language through the URL address [https://www.bgee.org/sparql/](https://bgee.org/sparql/).

For example, to retrieve all anatomic entities in _Rattus norvegicus_ where the APOC1 gene is expressed, the query is:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
SELECT DISTINCT ?anatEntity ?anatName {
	?seq a             orth:Gene ;
	     orth:organism ?organism ;
	     rdfs:label    ?geneName .
	?organism obo:RO_0002162 <http://purl.uniprot.org/taxonomy/10116> . #in_taxon
	?seq genex:isExpressedIn ?anatEntity .
	?anatEntity a genex:AnatomicalEntity .
	?anatEntity rdfs:label ?anatName .
	FILTER (LCASE(?geneName) = LCASE('APOC1'))
}
```

It is possible to download the result of this query in the [JSON](https://www.bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0ASELECT+DISTINCT+%3FanatEntity+%3FanatName+%7B%0D%0A++++%3Fseq+a+orth%3AGene+.%0D%0A++++%3Fseq+rdfs%3Alabel+%3FgeneName+.%0D%0A++++%3Fseq+genex%3AisExpressedIn+%3Fcond+.%0D%0A++++%3Fcond+genex%3AhasAnatomicalEntity+%3FanatEntity+.%0D%0A++++%3FanatEntity+rdfs%3Alabel+%3FanatName+.%0D%0A++++%3Fcond+obo%3ARO_0002162+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Ftaxonomy%2F10116%3E+.+%0D%0A++++FILTER+%28LCASE%28%3FgeneName%29+%3D+LCASE%28%27APOC1%27%29%29%0D%0A%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on&run=+Run+Query+) or [XML](https://www.bgee.org/sparql/?default-graph-uri=&query=PREFIX+orth%3A+%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0D%0APREFIX+up%3A+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0D%0APREFIX+genex%3A+%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0D%0APREFIX+obo%3A+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0D%0ASELECT+DISTINCT+%3FanatEntity+%3FanatName+%7B%0D%0A++++%3Fseq+a+orth%3AGene+.%0D%0A++++%3Fseq+rdfs%3Alabel+%3FgeneName+.%0D%0A++++%3Fseq+genex%3AisExpressedIn+%3Fcond+.%0D%0A++++%3Fcond+genex%3AhasAnatomicalEntity+%3FanatEntity+.%0D%0A++++%3FanatEntity+rdfs%3Alabel+%3FanatName+.%0D%0A++++%3Fcond+obo%3ARO_0002162+%3Chttp%3A%2F%2Fpurl.uniprot.org%2Ftaxonomy%2F10116%3E+.+%0D%0A++++FILTER+%28LCASE%28%3FgeneName%29+%3D+LCASE%28%27APOC1%27%29%29%0D%0A%7D&should-sponge=&format=application%2Fsparql-results%2Bxml&timeout=0&debug=on&run=+Run+Query+) format.

(Of note, as opposed to the example below to access an archived version, when accessing the endpoint for the latest version, it is important **NOT** to specify the name of a graph to target; otherwise, results will be incorrect)

## Stable programmatic access to this version of the Bgee SPARQL endpoint

This version of the Bgee SPARQL endpoint is accessible in a stable manner by using your preferred programming language through the stable URL address [https://www.bgee.org/sparql15_1/](https://bgee.org/sparql15_1/).

In the SELECT section of your query, it is essential to specify the URL of the graph you want to query (`https://bgee.org/rdf_v15_1`), otherwise you won't be using the data for this version. For example, to retrieve all anatomic entities in _Rattus norvegicus_ where the APOC1 gene is expressed, the query is:

```
PREFIX orth: <http://purl.org/net/orth#>
PREFIX genex: <http://purl.org/genex#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
SELECT DISTINCT ?anatEntity ?anatName FROM <https://bgee.org/rdf_v15_1> {
	?seq a             orth:Gene ;
	     orth:organism ?organism ;
	     rdfs:label    ?geneName .
	?organism obo:RO_0002162 <http://purl.uniprot.org/taxonomy/10116> . #in_taxon
	?seq genex:isExpressedIn ?anatEntity .
	?anatEntity a genex:AnatomicalEntity .
	?anatEntity rdfs:label ?anatName .
	FILTER (LCASE(?geneName) = LCASE('APOC1'))
}
```

Again, **it is essential to specify the name of the graph of the version to target** (in the example above, `https://bgee.org/rdf_v15_1`); otherwise, results will be incorrect.

## RDF serialisation and semantic models

The Bgee RDF data were created using an Ontology Based Data Access (OBDA) approach, so-called Ontop. The RDF serialisation of the '_EasyBgee_' database is based on the [GenEx semantic model specification](https://biosoda.github.io/genex/) and the OBDA mappings defined in [OBDA mappings](https://github.com/biosoda/bioquery/tree/master/Bgee_OBDA_mappings). The mappings are defined using the [Ontop mapping language](https://github.com/ontop/ontop/wiki/ontopOBDAModel). We also inferred all implicit information based on [OWL 2 Web Ontology Language Profile QL](https://www.w3.org/TR/owl2-profiles/#OWL_2_QL) reasoning over GenEx.

To cross-reference other resources, this SPARQL endpoint contains annotation property assertions defined by a first draft of the life-sciences cross-reference (LSCR) ontology that is available to download at the [Quest for Orthologs GitHub](https://github.com/qfo/OrthologyOntology) repository [here](https://github.com/qfo/OrthologyOntology/blob/master/lscr.ttl).

Download the latest Bgee RDF data dump [here](https://bgee.org/ftp/current/rdf_easybgee.zip).
