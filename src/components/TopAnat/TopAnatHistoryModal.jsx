/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useHistory } from 'react-router-dom';
import Bulma from '../Bulma';
import { ModalContext } from '../../contexts/ModalContext';
import PATHS from '../../paths/paths';
import imagePath from '../../helpers/imagePath';

const HISTORY_KEY = 'topAnatHistory';
const ModalContent = ({ history, onRemove, onLoad, hideModal }) => (
  <Bulma.Modal.Card.Wrapper>
    <Bulma.Modal.Card.Header>
      <Bulma.Modal.Card.Title>History</Bulma.Modal.Card.Title>
      {/* eslint-disable-next-line react/button-has-type */}
      <button className="delete" aria-label="close" onClick={hideModal} />
    </Bulma.Modal.Card.Header>

    <Bulma.Modal.Card.Body>
      {history.map((h, key) => (
        <div
          key={`${h.id}-${key}`}
          className="is-flex my-3 is-align-items-center"
        >
          <div className="is-flex is-flex-grow-1 is-align-items-center mr-3">
            <img
              src={imagePath(`/species/${h.speciesId}_light.jpg`)}
              style={{ height: 30, width: 30, marginRight: 10 }}
              title={`Species: ${h.speciesName}`}
            />
            <div>
              {h.title !== '' && <p className="mb-1">{h.title}</p>}
              <p>
                <u>{`(${h.creationDate})`}</u>
              </p>
            </div>
          </div>
          <div style={{ minWidth: 100 }}>
            <Bulma.Button
              className="is-outlined mr-2"
              color="info"
              type="button"
              onClick={onLoad && onLoad(h.id)}
            >
              <Bulma.IonIcon name="eye-outline" />
            </Bulma.Button>
            <Bulma.Button
              className="is-outlined mr-2"
              color="danger"
              type="button"
              onClick={onRemove && onRemove(h.id)}
            >
              <Bulma.IonIcon name="trash-outline" />
            </Bulma.Button>
          </div>
        </div>
      ))}
    </Bulma.Modal.Card.Body>
  </Bulma.Modal.Card.Wrapper>
);

export const addTopAnatHistory = (id, speciesId, speciesName, title = '') => {
  const h = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
  if (h.find((e) => e.id === id)) return;
  const t = new Date();
  const paddedValue = (v) => String(v).padStart(2, '0');
  h.push({
    id,
    speciesId,
    speciesName,
    title,
    creationDate: `${paddedValue(t.getDate())}/${paddedValue(
      t.getMonth()
    )}/${t.getFullYear()}, ${paddedValue(t.getHours())}:${paddedValue(
      t.getMinutes()
    )}:${paddedValue(t.getSeconds())}`,
  });
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
};

const TopAnatHistoryModal = () => {
  const navHistory = useHistory();
  const [history, setHistory] = React.useState([]);
  const { showModal, hideModal } = React.useContext(ModalContext);

  React.useEffect(() => {
    const h = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
    setHistory(h);

    const interval = setInterval(() => {
      const tmp = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
      setHistory(tmp);
    }, 2000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const onLoad = React.useCallback(
    (id) => () => {
      hideModal();
      navHistory.push(PATHS.ANALYSIS.TOP_ANAT_RESULT.replace(':id', id));
    },
    []
  );
  const onRemove = React.useCallback(
    (id) => () => {
      const h = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
      if (h.find((e) => e.id === id)) {
        h.splice(
          h.findIndex((e) => e.id === id),
          1
        );
        setHistory(h);
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(h));

        showModal(() => (
          <ModalContent
            history={h}
            onLoad={onLoad}
            onRemove={onRemove}
            hideModal={hideModal}
          />
        ));
      }
    },
    []
  );
  if (history.length === 0) return null;
  return (
    <button
      className="button is-bgee-link is-outlined mr-2"
      type="button"
      onClick={() =>
        showModal(() => (
          <ModalContent
            history={history}
            onLoad={onLoad}
            onRemove={onRemove}
            hideModal={hideModal}
          />
        ))
      }
    >
      <Bulma.IonIcon className="mr-1" name="list-outline" /> Recent jobs
    </button>
  );
};

export default TopAnatHistoryModal;
