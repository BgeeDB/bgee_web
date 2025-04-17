import { Link } from 'react-router';
import arrayHelper from './arrayHelper';
import LinkExternal from '../components/LinkExternal';
import Bulma from '../components/Bulma';
import classnames from './classnames';
import obfuscateMailLink from './obfuscateMailLink';

export const richTextBuilder = (elements, prefixKey = '') =>
  elements.map(({ type, id, classNames, ...props }, key) => {
    switch (type) {
      case 'break_line':
        return <br key={`${prefixKey}-${key}`} />;
      case 'bold':
        return (
          <b key={`${prefixKey}-${key}`} id={id} className={classNames}>
            {props.content}
          </b>
        );
      case 'code':
        return (
          <code key={`${prefixKey}-${key}`} className={props.classNames}>
            {props.content}
          </code>
        );
      case 'italic':
        return (
          <i key={`${prefixKey}-${key}`} id={id} className={classNames}>
            {props.content}
          </i>
        );
      case 'link_anchor':
        return (
          <a
            key={`${prefixKey}-${key}`}
            href={`#${props.selector}`}
            id={id}
            className={classnames('internal-link', classNames)}
          >
            {props.text}
          </a>
        );
      case 'link_internal':
        return (
          <Link key={`${prefixKey}-${key}`} to={props.path} id={id} className={classnames('internal-link', classNames)}>
            {props.text}
          </Link>
        );
      case 'link_external':
        return (
          <a
            key={`${prefixKey}-${key}`}
            href={props.path}
            target="_blank"
            rel="noopener noreferrer"
            id={id}
            className={classnames('external-link', classNames)}
          >
            {props.text}
          </a>
        );
      case 'link_mail':
        return (
          <a
            key={`${prefixKey}-${key}`}
            onClick={obfuscateMailLink(props.email)}
            id={id}
            className={classnames('mail-link', classNames)}
          >
            {props.text}
          </a>
        );
      case 'link_phone_number':
        return (
          <a key={`${prefixKey}-${key}`} href={`tel:${props.phoneNumber}`} id={id} className={classNames}>
            {props.text}
          </a>
        );
      case 'pre_code':
        return (
          <pre key={`${prefixKey}-${key}`}>
            <code id={id} className={classNames}>
              {props.content}
            </code>
          </pre>
        );
      case 'rich_text':
        return richTextBuilder(props.content, `${prefixKey}-${key}`);
      case 'text':
        return props.content;
      case 'underline':
        return (
          <u key={`${prefixKey}-${key}`} id={id} className={classNames}>
            {props.content}
          </u>
        );
      default:
        return null;
    }
  });

const gridBuilder = ({ cols, content, fillRow }) => (
  <>
    {arrayHelper
      .chunked(content, cols, {
        fillChunk: fillRow,
        defaultItemFactory: () => ({ children: [] }),
      })
      .map((tiles, rowIndex) => (
        <Bulma.Tile kind="ancestor" key={`row-${rowIndex}`}>
          {tiles.map(({ classNames, children }, tileIndex) => (
            <Bulma.Tile kind="parent" key={`tile-${rowIndex}-${tileIndex}`}>
              <Bulma.Tile kind="child" className={classnames(classNames)}>
                {staticBuilder(children)}
              </Bulma.Tile>
            </Bulma.Tile>
          ))}
        </Bulma.Tile>
      ))}
  </>
);

/*
  id={id}
  className={classnames('cardustomcard',classNames)}
 */
const staticBuilder = (json, prefixKey = '') =>
  json.map(({ type, id, classNames, ...props }, key) => {
    switch (type) {
      case 'break_line':
        return <br key={`${prefixKey}-${key}`} />;
      case 'bold':
        return (
          <p key={`${prefixKey}-${key}`} id={id} className={classnames(classNames)}>
            <b>{props.content}</b>
          </p>
        );
      case 'card': {
        const Component = () => (
          <div key={`${prefixKey}-${key}`} id={id} className={classnames('card custom-card', classNames)}>
            {props.image && (
              <div className="card-image">
                <figure className={`image ${props.imageClass ? props.imageClass : 'is-128x128'}`}>
                  <img alt={props.image.alt} {...props.image} />
                </figure>
              </div>
            )}

            <div className="card-content">
              <p className="card-title">{props.title}</p>
              {props.description && <p className="card-description">{props.description}</p>}
              {props.richDescription && <p className="card-description">{richTextBuilder(props.richDescription)}</p>}
            </div>
          </div>
        );
        if (props.linkType === 'internal')
          return (
            <Link to={props.link} key={`${prefixKey}-${key}`}>
              <Component />
            </Link>
          );
        if (props.linkType === 'external')
          return (
            <a href={props.link} key={`${prefixKey}-${key}`} target="_blank" rel="noopener noreferrer">
              <Component />
            </a>
          );
        return <Component />;
      }
      case 'columns':
        return (
          <div key={`${prefixKey}-${key}`} id={id} className={classnames('columns', classNames)}>
            {props.content.map((col, colKey) => (
              <div
                key={`${prefixKey}-${key}-${colKey}`}
                className={classnames(
                  'column',
                  {
                    [`is-${col.size}`]: col.size,
                  },
                  col.classNames
                )}
              >
                {staticBuilder(col.content, `${prefixKey}-${key}-${colKey}`)}
              </div>
            ))}
          </div>
        );
      case 'grid':
        return (
          <div key={`${prefixKey}-${key}`} id={id} className={classnames(classNames)}>
            {gridBuilder(props)}
          </div>
        );
      case 'link_anchor':
        return (
          <p key={`${prefixKey}-${key}`}>
            <a href={`#${props.selector}`} id={id} className={classnames('internal-link', classNames)}>
              {props.text}
            </a>
          </p>
        );
      case 'link_external':
        return (
          <LinkExternal key={`${prefixKey}-${key}`} to={props.path} text={props.text} id={id} className={classNames} />
        );
      case 'link_image':
        return (
          <a
            key={`${prefixKey}-${key}`}
            href={props.path}
            target="_blank"
            rel="noopener noreferrer"
            id={id}
            className={classnames(classNames)}
          >
            <img src={props.src} alt={props.alt} style={props.style} />
          </a>
        );
      case 'only_image':
        return <img src={props.src} alt={props.alt} style={props.style} />;
      case 'link_internal':
        return (
          <Link key={`${prefixKey}-${key}`} to={props.path} id={id} className={classnames('internal-link', classNames)}>
            {props.text}
          </Link>
        );
      case 'notification':
        return (
          <div key={`${prefixKey}-${key}`} id={id} className={classnames('notification', classNames)}>
            {props.content}
          </div>
        );
      case 'ordered_list':
        return (
          <ol key={`${prefixKey}-${key}`} id={id} className={classnames('ordered', classNames)}>
            {props.children.map((element) => (
              <li>{staticBuilder([element])}</li>
            ))}
          </ol>
        );
      case 'pre_code':
        return (
          <pre key={`${prefixKey}-${key}`}>
            <code id={id} className={classnames(classNames)}>
              {props.content}
            </code>
          </pre>
        );
      case 'rich_text':
        return (
          <p id={props.id} className={classnames(classNames)} key={`${prefixKey}-${key}`}>
            {richTextBuilder(props.content, `${prefixKey}-${key}`)}
          </p>
        );
      case 'subsection':
        return (
          <div id={props.id} key={`${prefixKey}-${key}`} className={classnames(classNames)}>
            <Bulma.Title size={5} className="h3-margin" renderAs="h3">
              {props.title}
            </Bulma.Title>
          </div>
        );
      case 'section':
        return (
          <div id={props.id} key={`${prefixKey}-${key}`} className={classnames(classNames)}>
            <Bulma.Title size={4} className="gradient-underline" renderAs="h2">
              {props.title}
            </Bulma.Title>
            <div className="">{staticBuilder(props.children)}</div>
          </div>
        );
      case 'separator':
        return <div key={`${prefixKey}-${key}`} className={classnames('separator', classNames)} />;
      case 'text':
        return (
          <p id={props.id} className={classnames(props.classNames)} key={`${prefixKey}-${key}`}>
            {props.content}
          </p>
        );
      case 'title':
        return (
          <div id={id} className={classnames('content has-text-centered', classNames)} key={`${prefixKey}-${key}`}>
            <Bulma.Title size={3} className="title is-3">
              {props.content}
            </Bulma.Title>
          </div>
        );
      case 'unordered_list':
        return (
          <ul className="unordered" key={`${prefixKey}-${key}`}>
            {props.children.map((element, eKey) => (
              <li key={`${prefixKey}-${key}-${eKey}`}>{staticBuilder([element], `ul-${prefixKey}-${key}-${eKey}`)}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  });

export default staticBuilder;
