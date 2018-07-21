import React from 'react'

class Footer extends React.Component {
  render () {
    return (
      <div>
        {/* footer-copyright start */}
        <footer className="footer-copyright">
          <div className="container">
            <div className="row">
              <div className="col-sm-7">
                <div className="foot-copyright pull-left">
                  
                    © 2018 Chrisfrew.in Productions. Theme by &nbsp;
                    <a href="https://www.themesine.com" className="white-bold-link">ThemeSINE</a> &amp; React-ified by <a href="https://chrisfrew.in" className="white-bold-link">Chrisfrew.in Productions</a>
                    <div>Favicon made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">CC 3.0 BY</a></div>
                  
                </div>{/*/.foot-copyright*/}
              </div>{/*/.col*/}
              <div className="col-sm-5">
                <div className="foot-menu pull-right white-bold-link">	  
                  <ul>
                    {/* <li><a href="https://sirenapparel.us/legal" class="white-bold-link">legal</a></li>
								<li><a href="https://sirenapparel.us/sitemap" class="white-bold-link">sitemap</a></li>
								<li><a href="https://sirenapparel.us/privacy-policy" class="white-bold-link">privacy policy</a></li> */}
                  </ul>
                </div>{/* /.foot-menu*/}
              </div>{/*/.col*/}
            </div>{/*/.row*/}
            <div id="scroll-Top">
              <i className="fa fa-angle-double-up return-to-top" id="scroll-top" data-toggle="tooltip" data-placement="top" data-original-title="Back to Top" aria-hidden="true" />
            </div>{/*/.scroll-Top*/}
          </div>{/* /.container*/}
        </footer>{/* /.footer-copyright*/}
        {/* footer-copyright end */}
      </div>
    );
  }
}

export default Footer;