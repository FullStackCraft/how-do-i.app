import React from 'react'
import { Container } from 'semantic-ui-react'

class Footer extends React.Component {
  render () {
    return (
      <div className="footer">
            <p>© 2018 Chrisfrew.in Productions. Theme by &nbsp;
            <a href="https://www.themesine.com">ThemeSINE</a> &amp; React-ified by <a href="https://chrisfrew.in">Chrisfrew.in Productions</a>
            <div>Favicon / Logo made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> &nbsp;
            from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> &nbsp;
            is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">
            CC 3.0 BY</a></div>
        </p>
      </div>
    );
  }
}

export default Footer;