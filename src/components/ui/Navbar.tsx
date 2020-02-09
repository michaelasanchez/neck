import * as React from 'react'

import { Button } from 'react-bootstrap';

export interface NavbarProps {
  show: any;
  test: any;
}

export class Navbar extends React.Component<NavbarProps, {}> {

  constructor(props: any) {
    super(props);

    this.state = {

    }

    console.log('Navbar', this);
  }

  handleShow() {
    console.log('show', this.props);
    this.props.show();
  }

  render() {
    console.log('Again', this.props);
    return (
      <nav className="navbar navbar-expand fixed-bottom justify-content-between navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Neck</a>
        <div className="navbar-nav">

          <form className="form-inline">
            <Button variant="outline-success" className="options" onClick={() => this.handleShow()}>
              Options
              </Button>

            <div className="nav-item btn-group dropup">
              <button type="button" className="btn btn-secondary">
                Key of C
                  </button>
              <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown">
              </button>

              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item"></a>
              </div>
            </div>
          </form>

        </div>
      </nav>
    );
  }
}