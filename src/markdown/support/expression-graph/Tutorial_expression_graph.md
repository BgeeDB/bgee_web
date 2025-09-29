# Gene Expression Graph

This tutorial explains how to use the gene expression graph, which is used in the [gene expression comparison](/search/expression-matrix 'Expression comparison graph') and on the [gene page](/gene/ENSG00000244734 'Example gene page').

The use in the gene page (single-gene) is different from that in the expression comparison (multi-gene), so we will first explain the common features and later explain the specific features of both of the former pages.

- [What the graph shows](#what-the-graph-shows 'Jump to this section')
- [How to use the graph](#how-to-use-the-graph 'Jump to this section')
- [Technical details](#technical-details 'Jump to this section')
- [Feedback](#feedback 'Jump to this section')

## What the graph shows

The expression graph displays the expression of one or multiple genes in different tissues as a heatmap. The displayed value is the expression score calculated by us. See the main Bgee publications for details.

- x axis: represents the respective gene(s).
- y axis: represents the anatomical entity (tissue, cell type).
- color: represents the expression score, as calculated by Bgee:
  - Expression scores of expression calls is based on the rank of a gene in a condition according to its expression levels (non-parametric statistics), normalized using the minimum and maximum Rank of the species. Values of Expression scores are between 0 and 100. Low score means that the gene is lowly expressed in the condition compared to other genes. Scores are normalized and comparable across genes, conditions and species.
  - Gray: Gene has been called as "not expressed" in the given condition.
  - White: There is no data for that gene in that condition.

## How to use the graph

Hover over heatmap cells to reveal a tooltip showing the corresponding value:

![](../img/doc/expression-graph/Fig02_expression-graph-tooltip.png)

Click on heatmap cell to display detail view. From there you can access links to the ontology terms (anatomy, cell type) and source datasets:

![](../img/doc/expression-graph/Fig03_expression-graph-detail-view.png)

Expand a condition term to reveal expression data for child terms:

![](../img/doc/expression-graph/Fig04_expression-graph-drilldown.png)

### Export options

- Download graph as SVG or PNG file
- Download underlying data in tabular format as TSV file

Note the download buttons below the graph:

![](../img/doc/expression-graph/Fig05_expression-graph-download.png)

### Settings

There are several display and style settings that can be expanded by clicking on the "Settings" button below the graph:

![](../img/doc/expression-graph/Fig06_expression-graph-settings.png)

- **Graph width**: Determines the total graph width.
- **Graph height**: Determines the total graph height.
- **Show legend**: Shows / hides the color legend.
- **Y label width**: Determines the width of the y labels.
- **Color palette**: Lets the user choose between different color palettes (derived from the ['viridis' R package](https://cran.r-project.org/web/packages/viridis/))
- **Adaptive color scale**: When selected, the color scale is limited to the max expression value displayed in the graph, otherwise the scale is [0,100].
- **Background color**: Select a different background color (default is 'white').

## Technical details

The displayed top-level anatomical entities contain a curated list of 20 UBERON terms:

- [body wall](https://purl.obolibrary.org/obo/UBERON_0000309 'UBERON_0000309')
- [central nervous system](https://purl.obolibrary.org/obo/UBERON_0001017 'UBERON:0001017')
- [circulatory system](https://purl.obolibrary.org/obo/UBERON_0001009 'UBERON:0001009')
- [connective tissue](https://purl.obolibrary.org/obo/UBERON_0002384 'UBERON:0002384')
- [digestive system](https://purl.obolibrary.org/obo/UBERON_0001007 'UBERON:0001007')
- [endocrine system](https://purl.obolibrary.org/obo/UBERON_0000949 'UBERON:0000949')
- [exocrine system](https://purl.obolibrary.org/obo/UBERON_0002330 'UBERON:0002330')
- [glandular system](https://purl.obolibrary.org/obo/UBERON_0015204 'UBERON:0015204')
- [hemolymphoid system](https://purl.obolibrary.org/obo/UBERON_0002193 'UBERON:0002193')
- [immune system](https://purl.obolibrary.org/obo/UBERON_0002405 'UBERON:0002405')
- [integumental system](https://purl.obolibrary.org/obo/UBERON_0002416 'UBERON:0002416')
- [ligament](https://purl.obolibrary.org/obo/UBERON_0000211 'UBERON:0000211')
- [multicellular organism](https://purl.obolibrary.org/obo/UBERON_0000468 'UBERON_0000468') (While this term is technically a parent term of the other ones, some data sets are derived from whole body samples and are therefore annotated as 'multicellular organism'.)
- [musculature](https://purl.obolibrary.org/obo/UBERON_0001015 'UBERON:0001015')
- [peripheral nervous system](https://purl.obolibrary.org/obo/UBERON_0000010 'UBERON:0000010')
- [renal system](https://purl.obolibrary.org/obo/UBERON_0001008 'UBERON:0001008')
- [reproductive system](https://purl.obolibrary.org/obo/UBERON_0000990 'UBERON:0000990')
- [respiratory system](https://purl.obolibrary.org/obo/UBERON_0001004 'UBERON:0001004')
- [sensory system](https://purl.obolibrary.org/obo/UBERON_0001032 'UBERON:0001032')
- [skeletal system](https://purl.obolibrary.org/obo/UBERON_0001434 'UBERON:0001434')

The root term of the top-level terms is [anatomical entity](https://purl.obolibrary.org/obo/UBERON_0001062 'UBERON_0001062').

Any data points that are not linked to any of the top-level terms are displayed as children of 'anatomical entity'.

## Feedback

If you are missing anything in the graph, please let us know using the feedback form below the graph. We appreciate all kinds of feedback!
