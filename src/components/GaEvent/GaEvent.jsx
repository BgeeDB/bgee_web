import config from '../../config.json';

const GaEvent = ({ category, action, label, value, children }) => {
  const handleClick = () => {
    if (category && action) {
      const script = document.createElement('script');
      script.innerHTML = `_paq.push(['trackEvent', '${category}_${config.version}', '${label}', ${value}]);`;
      document.head.appendChild(script);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <span onClick={handleClick} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
      {children}
    </span>
  );
};

export default GaEvent;
