import React from 'react';

const CreativeCommons = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <p className="is-size-7">
        {`Images from Wikimedia Commons. In most cases, pictures corresponds to the sequenced strains.  `}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <a onClick={() => setIsOpen(!isOpen)}>
          Show information about original images.
        </a>
      </p>
      <div id="creativecommons" className={isOpen ? 'is-open' : ''}>
        <p>
          <i>Homo sapiens</i> picture by Leonardo da Vinci (Life time: 1519)
          [Public domain].{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AUomo_Vitruviano.jpg"
            className="external-link"
          >
            See <i>H. sapiens</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Mus musculus</i> picture by Rasbak [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AApodemus_sylvaticus_bosmuis.jpg"
            className="external-link"
          >
            See <i>M. musculus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Danio rerio</i> picture by Azul (Own work) [see page for license],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AZebrafisch.jpg"
            className="external-link"
          >
            See <i>D. rerio</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Drosophila melanogaster</i> picture by Andr&eacute; Karwath aka Aka (Own
          work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.5"
            className="external-link"
          >
            CC-BY-SA-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ADrosophila_melanogaster_-_side_(aka).jpg"
            className="external-link"
          >
            See <i>D. melanogaster</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Caenorhabditis elegans</i> picture by Bob Goldstein, UNC Chapel
          Hill http://bio.unc.edu/people/faculty/goldstein/ (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ACelegansGoldsteinLabUNC.jpg"
            className="external-link"
          >
            See <i>C. elegans</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Pan troglodytes</i> picture by Thomas Lersch (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>
          ,{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/2.5"
            className="external-link"
          >
            CC-BY-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ASchimpanse_Zoo_Leipzig.jpg"
            className="external-link"
          >
            See <i>P. troglodytes</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Pan paniscus</i> picture by Ltshears (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ABonobo1_CincinnatiZoo.jpg"
            className="external-link"
          >
            See <i>P. paniscus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Gorilla gorilla</i> picture by Brocken Inaglory (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AMale_gorilla_in_SF_zoo.jpg"
            className="external-link"
          >
            See <i>G. gorilla</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Macaca mulatta</i> picture by Aiwok (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0-2.5-2.0-1.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AMacaca_mulatta_3.JPG"
            className="external-link"
          >
            See <i>M. mulatta</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Rattus norvegicus</i> picture by Reg Mckenna (originally posted to
          Flickr as Wild Rat) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/2.0"
            className="external-link"
          >
            CC-BY-2.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AWildRat.jpg"
            className="external-link"
          >
            See <i>R. norvegicus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Bos taurus</i> picture by User Robert Merkel on en.wikipedia (US
          Department of Agriculture) [Public domain],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AHereford_bull_large.jpg"
            className="external-link"
          >
            See <i>B. taurus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Sus scrofa</i> picture by Joshua Lutz (Own work) [Public domain],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ASus_scrofa_scrofa.jpg"
            className="external-link"
          >
            See <i>S. scrofa</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Equus caballus</i> picture by Doug Antczak Baker Institute for
          Animal Health College of Veterinary Medicine Cornell University
          [Public Domain],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File:Twilight20008-300.jpg"
            className="external-link"
          >
            See <i>E. caballus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Oryctolagus cuniculus</i> picture by JJ Harrison (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File:Oryctolagus_cuniculus_Tasmania_2.jpg"
            className="external-link"
          >
            See <i>O. cuniculus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Canis lupus familiaris</i> picture by Mood210 (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File:Male_fawn_Boxer_undocked.jpg"
            className="external-link"
          >
            See <i>C. lupus familiaris</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Felis catus</i> picture [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File:Valentino.jpg"
            className="external-link"
          >
            See <i>F. catus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Cavia porcellus</i> picture by Variraptor (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File:Yoyocochondinde.JPG"
            className="external-link"
          >
            See <i>C. porcellus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Monodelphis domestica</i> picture by{' '}
          <i>Marsupial Genome Sheds Light on the Evolution of Immunity.</i> Hill
          E, PLoS Biology Vol. 4/3/2006, e75{' '}
          <a
            rel="nofollow"
            href="http://dx.doi.org/10.1371/journal.pbio.0040075"
          >
            http://dx.doi.org/10.1371/journal.pbio.0040075
          </a>{' '}
          [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/2.5"
            className="external-link"
          >
            CC-BY-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AOpossum_with_young.png"
            className="external-link"
          >
            See <i>M. domestica</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Ornithorhynchus anatinus</i> picture by Dr. Philip Bethge (private)
          [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0-2.5-2.0-1.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AOrnithorhynchus.jpg"
            className="external-link"
          >
            See <i>O. anatinus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Gallus gallus</i> picture by Subramanya C K (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ARed_jungle_fowl.png"
            className="external-link"
          >
            See <i>G. gallus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Anolis carolinensis</i> picture by PiccoloNamek (Moved from
          Image:P1010027.jpg) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AAnolis_carolinensis.jpg"
            className="external-link"
          >
            See <i>A. carolinensis</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Xenopus tropicalis</i> picture by V&aacute;clav Gvo&#382;d&iacute;k
          (http://calphotos.berkeley.edu) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.5"
            className="external-link"
          >
            CC-BY-SA-2.5
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AXenopus_tropicalis01.jpeg"
            className="external-link"
          >
            See <i>X. tropicalis</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Xenopus laevis</i> picture by Brian Gratwicke
          (https://www.flickr.com/photos/19731486@N07/8325732255) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/2.0"
            className="external-link"
          >
            CC-BY-2.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AXenopus_laevis_02.jpg"
            className="external-link"
          >
            See <i>X. laevis</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Branchiostoma lanceolatum</i> picture by Hans Hillewaert (Own work)
          [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0"
            className="external-link"
          >
            CC-BY-SA-4.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ABranchiostoma_lanceolatum.jpg"
            className="external-link"
          >
            See <i>B. lanceolatum</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Latimeria chalumnae</i> picture by Alberto Fernandez Fernandez (Own
          work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>
          ,{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.5"
            className="external-link"
          >
            CC-BY-SA-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ALatimeria_Chalumnae_-_Coelacanth_-_NHMW.jpg"
            className="external-link"
          >
            See <i>L. chalumnae</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Lepisosteus oculatus</i> picture by Brian Gratwicke (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/2.5"
            className="external-link"
          >
            CC-BY-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ALepisosteus_oculatus1.jpg"
            className="external-link"
          >
            See <i>L. oculatus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Anguilla anguilla</i> picture by GerardM
          (http://www.digischool.nl/bi/onderwaterbiologie/) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AAnguilla_anguilla.jpg"
            className="external-link"
          >
            See <i>A. anguilla</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Astyanax mexicanus</i> picture by H. Zell (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AAstyanax_mexicanus_01.jpg"
            className="external-link"
          >
            See <i>A. mexicanus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Esox lucius</i> picture by Jik jik (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0-2.5-2.0-1.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AEsox_lucius_ZOO_1.jpg"
            className="external-link"
          >
            See <i>E. lucius</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Salmo salar</i> picture by Hans-Petter Fjeld (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.5"
            className="external-link"
          >
            CC-BY-SA-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ASalmo_salar-Atlantic_Salmon-Atlanterhavsparken_Norway.JPG"
            className="external-link"
          >
            See <i>S. salar</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Gadus morhua</i> picture by Hans-Petter Fjeld (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.5"
            className="external-link"
          >
            CC-BY-SA-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AGadus_morhua_Cod-2b-Atlanterhavsparken-Norway.JPG"
            className="external-link"
          >
            See <i>G. morhua</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Poecilia reticulata</i> picture by Per Harald Olsen (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/3.0"
            className="external-link"
          >
            CC-BY-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AGuppy_pho_0048.jpg"
            className="external-link"
          >
            See <i>P. reticulata</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Oryzias latipes</i> picture by NOZO (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/3.0"
            className="external-link"
          >
            CC-BY-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ANihonmedaka.jpg"
            className="external-link"
          >
            See <i>O. latipes</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Astatotilapia calliptera</i> picture by Alexandra Tyers
          (https://www.flickr.com/photos/52993488@N03/5441877789) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.0"
            className="external-link"
          >
            CC-BY-SA-2.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AAstatotilapia_calliptera.jpg"
            className="external-link"
          >
            See <i>A. calliptera</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Meleagris gallopavo</i> picture by Riki7 (Own work) [Public
          domain],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AGall-dindi.jpg"
            className="external-link"
          >
            See <i>M. gallopavo</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Callithrix jacchus</i> picture by Leszek Leszczynski
          (https://www.flickr.com/photos/leszekleszczynski/6952548339/) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/2.0"
            className="external-link"
          >
            CC-BY-2.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ACommon_marmoset_(Callithrix_jacchus).jpg"
            className="external-link"
          >
            See <i>C. jacchus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Cercocebus atys</i> picture by Giulio Russo Photography (Own work)
          [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by/4.0"
            className="external-link"
          >
            CC-BY-4.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ACercocebo_Dal_Collare.jpg"
            className="external-link"
          >
            See <i>C. atys</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Macaca fascicularis</i> picture by Andr&eacute; Ueberbach (Eigene Aufnahme
          von Andr&eacute; Ueberbach/Own production) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.0/de"
            className="external-link"
          >
            CC-BY-SA-2.0 DE
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AMacaca_fascicularis.jpg"
            className="external-link"
          >
            See <i>M. fascicularis</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Macaca nemestrina</i> picture by Hectonichus (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ACercopithecidae_-_Macaca_nemastrina.jpg"
            className="external-link"
          >
            See <i>M. nemestrina</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Papio anubis</i> picture by Charles J. Sharp (Own work, from Sharp
          Photography, http://www.sharpphotography.co.uk/) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0"
            className="external-link"
          >
            CC-BY-SA-4.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AOlive_baboon_(Papio_anubis)_with_juvenile.jpg"
            className="external-link"
          >
            See <i>P. anubis</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Capra hircus</i> picture by flagstaffotos [at] gmail.com (Own work)
          [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ADomestic_goat_May_2006.jpg"
            className="external-link"
          >
            See <i>C. hircus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Ovis aries</i> picture by Jacquie Wingate from Recovery, USA
          (https://www.flickr.com/photos/11948828@N00/2212889583/) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/1.0"
            className="external-link"
          >
            CC-BY-SA-1.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ATake_ours!.jpg"
            className="external-link"
          >
            See <i>O. aries</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Manis javanica</i> picture by Frendi Apen Irawan (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0"
            className="external-link"
          >
            CC-BY-SA-4.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ATrenggiling_Sunda_Sunda_Pangolin_Manis_javanica.jpg"
            className="external-link"
          >
            See <i>M. javanica</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Heterocephalus glaber</i> picture by Roman Klementschitz, Wien (Own
          work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ANacktmull.jpg"
            className="external-link"
          >
            See <i>H. glaber</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Microcebus murinus</i> picture by Charles J. Sharp (Own work, from
          Sharp Photography, http://www.sharpphotography.co.uk/) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AGray_mouse_lemur_microcebus_murinus.jpg"
            className="external-link"
          >
            See <i>M. murinus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Neolamprologus brichardi</i> picture by David Midgley
          (www.sydneycichlid.com) (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/2.5"
            className="external-link"
          >
            CC-BY-SA-2.5
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ANeolamprologus_brichardi.jpg"
            className="external-link"
          >
            See <i>N. brichardi</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Scophthalmus maximus</i> picture by Luc Viatour (Own work
          http://www.lucnix.be/) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0-2.5-2.0-1.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3APsetta_maxima_Luc_Viatour.jpg"
            className="external-link"
          >
            See <i>S. maximus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Chlorocebus sabaeus</i> picture by Charles J. Sharp (Own work, from
          Sharp Photography, http://www.sharpphotography.co.uk/) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/4.0"
            className="external-link"
          >
            CC-BY-SA-4.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3AGreen_monkey_(Chlorocebus_sabaeus)_male.jpg"
            className="external-link"
          >
            See <i>C. sabaeus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Gasterosteus aculeatus</i> picture by Viridiflavus (Own work) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3APICT0246-1.JPG"
            className="external-link"
          >
            See <i>G. aculeatus</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Nothobranchius furzeri</i> picture by Ugau (Own work, Leibniz
          Institute for Age Research - Fritz Lipmann Institute (FLI), Jena,
          Germany) [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.gnu.org/copyleft/fdl.html"
            className="external-link"
          >
            GFDL
          </a>{' '}
          or{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-sa/3.0"
            className="external-link"
          >
            CC-BY-SA-3.0
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://commons.wikimedia.org/wiki/File%3ANothobranchius_furzeri_GRZ_thumb.jpg"
            className="external-link"
          >
            See <i>N. furzeri</i> picture via Wikimedia Commons
          </a>
        </p>
        <p>
          <i>Drosophila pseudoobscura</i> picture,{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://metazoa.ensembl.org/i/species/Drosophila_pseudoobscura.png"
            className="external-link"
          >
            See <i>D. pseudoobscura </i> picture via Ensembl Metazoa
          </a>
        </p>
        <p>
          <i>Drosophila simulans</i> picture by Nicolas Gompel [
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://creativecommons.org/licenses/by-nc-sa/2.0/"
            className="external-link"
          >
            CC BY-NC-SA 2.0 FR
          </a>
          ],{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://gompel.org/images-2/drosophilidae"
            className="external-link"
          >
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            See <i>D. simulans</i> picture via Nicolas Gompel's lab website
          </a>
        </p>
      </div>
    </>
  );
};

export default CreativeCommons;
