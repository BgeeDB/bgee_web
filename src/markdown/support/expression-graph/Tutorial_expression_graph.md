# Expression graph

This tutorial explains the multi-species expression graph: how to choose genes from one or several species, and how to read the comparison. The figures use the [SERPINC1 antithrombin genes](/search/expression-matrix?gene_list=ENSG00000117601%0AENSMUSG00000026715%0AENSFCAG00000014923%0AENSECAG00000014493%0AENSSSCG00000015493%0AENSBTAG00000004362%0AENSCHIG00000010653%0AENSOARG00000012929%0AENSOCUG00000002891%0AENSOANG00000000923%0AENSCJAG00000009182%0AENSCATG00000034060%0AENSMFAG00000031906%0AENSMMUG00000000629%0AENSMNEG00000008415%0AENSPANG00000004954%0AENSPPAG00000042631%0AENSPTRG00000001701%0AENSMICG00000002980%0A108405505%0AENSRNOG00000002783%0AENSHGLG00000007370%0AENSMODG00000004202 'SERPINC1 genes across species'). Open that link to follow along. The same page also links a few other ready-made comparisons.

- [Choosing genes](#choosing-genes 'Jump to this section')
- [Data filters](#data-filters 'Jump to this section')
- [Reading the graph](#reading-the-graph 'Jump to this section')
- [Species axis](#species-axis 'Jump to this section')
- [Exploring anatomy](#exploring-anatomy 'Jump to this section')
- [Download and settings](#download-and-settings 'Jump to this section')
- [How the rows are chosen](#how-the-rows-are-chosen 'Jump to this section')

Open **Expression graph** from the Tools menu. The page has two steps: choose the genes, then read the graph. **Hide Form** / **Show Form** tucks the form away once the graph is drawn.

## Choosing genes

**Pick species & genes** selects one species, then one or more of its genes. **Add genes from another species** keeps the genes already chosen and highlights the species field so you can add the next species. Genes already in the list stay there. **Paste gene list (multi-species)** is the other way to choose genes: one gene identifier per line, from any species in Bgee.

Chosen genes are listed under **Selected Genes**. The figure shows the first rows of the SERPINC1 comparison. The full list is longer, which is why **All** reports 23 genes.

![Species and gene pickers, with the first SERPINC1 genes in the selected list](../img/doc/expression-graph/Fig01_gene-selection.webp#tutoimgborder)

Each row shows the species and the gene, and both names link to their pages. Drag a row by the handle to change the column order. The trash button removes a gene.

**All**, **With data**, and **No data** filter that list after a search. **With data** and **No data** count genes from the last search. A gene you add afterwards stays under **All** until you click **Show graph** again. In the SERPINC1 example every selected gene has expression data, so **No data** is 0.

The **+** on a row opens **Add orthologs or paralogs**. Orthologs and paralogs are grouped by the taxon where they were found, from the most specific taxon to the broadest. The count beside a taxon is the number of those genes that are not yet in the list. A taxon whose genes are all already selected is marked **all added**. Pick one ortholog taxon, one paralog taxon, or one of each, then add them. For human SERPINC1, the primate ortholog groups are already in the example list, and broader taxa such as Amniota and Tetrapoda still have genes to add. Paralogs are offered at Eumetazoa and Opisthokonta.

![Ortholog and paralog taxa that can be added for human SERPINC1](../img/doc/expression-graph/Fig03_add-homologs.webp#tutoimgborder)

**Show graph** runs the search. It stays disabled until at least one gene is selected. **Reinitialize** clears the form.

## Data filters

**Data filters** are optional. They limit which calls are included for the genes you selected. Open the panel, change the filters, then click **Show graph** again.

![Tissue, cell type, data type, and data quality filters](../img/doc/expression-graph/Fig04_data-filters.webp#tutoimgborder)

- **Tissue** and **Cell type** limit the anatomy. **Including substructures** starts selected and also retrieves calls in parts of the terms you enter, for example every part of the brain.
- **Data type** chooses bulk RNA-Seq, scRNA-Seq, and in situ hybridization. Calls are produced by integrating the types you leave selected.
- **Data quality** sets the minimum support required for a call. **Silver** is the default (a present call with p-value ≤ 0.05). **Gold** is stricter (present call, p-value ≤ 0.01). **Bronze** also keeps a present call that is not itself significant at 0.05 when at least one of its sub-conditions is. The **?** next to Data quality states the full present and absent rules.

## Reading the graph

Each column is a gene. Each row is an anatomical structure, or a cell type inside one. The color is the Bgee expression score.

An expression score ranks a gene in a condition by its expression level (a non-parametric statistic), then normalizes that rank with the minimum and maximum rank of the species. Scores run from 0 to 100. A low score means the gene is lowly expressed in that condition compared with other genes. Scores are comparable across genes, conditions, and species. See the [Bgee publications](/about/publications 'Bgee publications') for the method. The **?** next to "Expression score" repeats this definition.

On the SERPINC1 graph the columns are grouped by species, with the taxonomy drawn above the species names. Gene names run along the bottom. **Not expressed** is a gray cell. **No data** is a white cell.

![SERPINC1 expression across species, with the taxonomy above the columns](../img/doc/expression-graph/Fig06_serpinc1-graph.webp#tutoimgborder)

Two numbers can sit on one cell.

- The **fill** is the expression score of that row itself.
- The **border** is the best expression score among the structures and cell types under that row (the best descendant score). A parent organ can be pale while its border is yellow, because a child structure is highly expressed. In the SERPINC1 graph the digestive system and the endocrine system carry yellow borders: the highest score in those branches sits in a child structure.

While a row is open, the children that carry its best score are marked:

- A **filled triangle** in the top-right corner means this child's own score is the parent's best descendant score. Every child with that same score is marked.
- An **open triangle** means this child's own score is lower, and its best descendant score matches the parent. The high score is further down that branch.

**Anatomical entity** starts open, so those marks can already appear on the organ rows. The legend under the color scale names the border and both triangles.

Hover a cell for a short tooltip: species, gene, anatomy, the cell's own value, the best descendant score, and whether the gene is expressed. A triangle adds a highlight line, either "best descendant of the parent" or "branch of the parent's best descendant."

![Tooltip for macaque SERPINC1 in the endocrine system](../img/doc/expression-graph/Fig07_tooltip.webp#tutoimgborder)

Click a cell to open the detail card beside the graph. It links the species, the gene, the anatomical entity, and the cell type. Ontology pages open in a new tab. The card also shows which data types support the call, the call quality, both scores, and a **See source data** link to the processed expression values. Close it with **✕**.

The data-type tags use the same letters as elsewhere in Bgee:

- **R** — bulk RNA-Seq
- **SC** — single-cell RNA-Seq
- **I** — in situ hybridization

A green tag means that data type contributed to the call. A gray tag means it did not.

![Detail card for macaque SERPINC1 in the endocrine system](../img/doc/expression-graph/Fig08_detail-view.webp#tutoimgborder)

## Species axis

When the result contains genes from more than one species, **Species axis** appears above the graph.

![Tree and Flat choices for the species axis](../img/doc/expression-graph/Fig05_species-axis.webp#tutoimgborder)

**Tree** is the default. Columns are grouped by species and ordered by the taxonomy, as in the SERPINC1 figure. Species names are drawn above the gene names. A species with several genes gets a bracket across those columns. Higher taxa are labeled above the species. Click a species or a taxon to highlight its columns, and click it again to clear the highlight.

**Flat** labels each gene on its own and keeps the column order you chose.

Dragging a gene so that one species is split across other species, or so that a clade is interrupted, switches the axis to **Flat** and keeps that order. Choosing **Tree** again sorts the columns back into taxonomic order. Choosing **Flat** after that returns to the order from before the tree sort.

## Exploring anatomy

The first view is a short list of major organs under **anatomical entity**. Click **[+]** on a row to load its child structures. Click **[−]** to collapse that row. Child labels are indented under the parent.

Opening **digestive system** in the SERPINC1 graph lists its child structures, including parts of the stomach, the intestine, and the colon. The border on that row is the best score among those children.

![Digestive system expanded under the SERPINC1 comparison](../img/doc/expression-graph/Fig09_drilldown.webp#tutoimgborder)

Cell types are nested under the organ they belong to.

- An organ that has its own expression call stays the header, and its cell types appear underneath.
- An organ that only has cell-type calls gets a header for that organ, with the cell types listed by name under it.

**Collapse single-cell data**, in Settings, hides those cell-type rows. Each group keeps a **[+]**, so you can open one organ's cell types without opening the rest. The choice is remembered in this browser.

**Row ordering** sorts sibling rows:

- **alphabetically** is the default.
- **expression score** puts the highest score first. **Aggregation function** chooses whether that score is the **mean** or the **max** across the genes in the row. It is used when rows are sorted by expression score.

Cell types stay together, after the anatomical children of the same parent. The **others** row stays last in either order.

## Download and settings

Under the graph, **Download** saves the figure or the table. **PNG** and **SVG** save the graph as drawn, including the legend. **TSV** saves the cell records: gene, anatomical term, score, and the related fields.

![PNG, SVG, and TSV download buttons](../img/doc/expression-graph/Fig10_download.webp#tutoimgborder)

**Settings** / **Expand** opens three groups. Changes apply to the graph immediately. Width and height are applied when you leave the field. The choices are remembered in this browser, so the next graph opens with the same palette, row order, and single-cell collapse.

![Display, style, and data settings under the graph](../img/doc/expression-graph/Fig11_settings.webp#tutoimgborder)

### Display

- **Graph width** is the width of the visible area. A wider drawing scrolls sideways inside it.
- **Graph height** sets the height of the drawing.
- **Cell width** is the column width. Columns shrink when many genes have to fit.
- **Show Legend** shows or hides the color scale and the border and triangle key.
- **Y label width** is the minimum space reserved for anatomical names. A long expanded label widens the margin past this value, and collapsing that row lets the margin return to it.

### Style

- **color palette** chooses the scale. The palettes are magma, inferno, plasma, viridis, cividis, rocket, mako, and turbo, from the ['viridis' R package](https://cran.r-project.org/web/packages/viridis/ 'viridis palettes').
- **background color** sets the color behind the cells. The default is white, which is also how a cell with no data appears. The hairline inside a score border uses this color.
- **adaptive color scale** stretches the colors across the scores currently on screen. Leave it off to keep the scale fixed from 0 to 100, so colors stay comparable between graphs.

### Data

- **Collapse single-cell data** hides cell-type rows, as described in [Exploring anatomy](#exploring-anatomy 'Exploring anatomy').
- **Row ordering** and **Aggregation function** sort the rows, as described in the same section.

## How the rows are chosen

The first rows are a curated summary of major anatomical systems, limited to systems that have a call for the genes in the graph. They are children of [anatomical entity](https://purl.obolibrary.org/obo/UBERON_0001062 'UBERON:0001062'). A row with no cell type uses the cell-type root, [cellular component](https://purl.obolibrary.org/obo/GO_0005575 'GO:0005575').

**others** is the last row. It collects calls that are not part of that summary, including structures outside those organs and calls annotated only to a broad parent. Expand it to load those terms.

Expanding any other row loads the child anatomical structures of that organ. Child rows do not repeat the other summary organs, so opening one system does not list the sibling systems that happen to sit under it in the ontology. Cell types of the opened organ are grouped under it, as described above.
