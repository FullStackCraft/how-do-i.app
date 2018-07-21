import React from 'react'

class Loader extends React.Component {
  render () {
    return (
      <div>
        <div className="loader" id="loader-2">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="text-center"><span role="img" aria-label="genie">🧞</span><span role="img" aria-label="genie">🧞</span><span role="img" aria-label="genie">🧞</span>The genie is thinking...<span role="img" aria-label="genie">🧞</span><span role="img" aria-label="genie">🧞</span><span role="img" aria-label="genie">🧞</span></p>
      </div>
    );
  }
}

export default Loader;