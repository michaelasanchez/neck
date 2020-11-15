import 'bootstrap/dist/css/bootstrap.css';
import 'rc-slider/assets/index.css';
import './style/app.scss';

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";

ReactDOM.render(
  <App />,
  document.querySelector('.app')
)
