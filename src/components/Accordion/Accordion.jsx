/* eslint-disable react/no-string-refs */
import React from 'react';
import bulmaCollapsible from '@creativebulma/bulma-collapsible/src/js';
import uuid from '../../helpers/uuid';
import Bulma from '../Bulma';

class Accordion extends React.Component {
  constructor(props) {
    super(props);
    this.id = `accordion-${uuid()}`;
    this.myRef = React.createRef();
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    this.collapsibles = bulmaCollapsible.attach('.is-collapsible', {
      container: this.myRef.current,
    });
  }

  render() {
    const { elements } = this.props;
    return (
      <div
        ref={this.myRef}
        id={this.id}
        className="custom-accordion"
        key={this.id}
      >
        {elements.map(({ title, body }, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <Bulma.Message key={`${this.id}-${key}`}>
            <Bulma.Message.Header
              renderAs="a"
              href={`#collapsible-message-accordion-${key}`}
              data-action="collapse"
            >
              {title}
            </Bulma.Message.Header>
            <Bulma.Message.Body
              id={`collapsible-message-accordion-${key}`}
              className="is-collapsible"
              data-parent={this.id}
            >
              <div className="message-body-content">{body}</div>
            </Bulma.Message.Body>
          </Bulma.Message>
        ))}
      </div>
    );
  }
}

export default Accordion;
