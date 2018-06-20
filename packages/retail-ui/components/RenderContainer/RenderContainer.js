// @flow

import * as React from 'react';
import ReactDOM from 'react-dom';

let lastID = 0;
function nextID() {
  return ++lastID;
}
function setID(id) {
  lastID = id;
}

const REACT_16 = !!ReactDOM.createPortal;

export default class RenderContainer extends React.Component<*> {
  _domContainer: HTMLElement;

  _testID: number;

  constructor(props: {}, context: {}) {
    super(props, context);

    this._domContainer = document.createElement('div');
    this._hydrateId();

    this._testID = nextID();
    this._domContainer.setAttribute(
      'data-rendered-container-id',
      this._testID.toString()
    );
    this._domContainer.className = 'react-ui';

    const { body } = document;
    if (!body) {
      throw Error('There is no "body" in "document"');
    }
    body.appendChild(this._domContainer);

    if (window.ReactTesting) {
      window.ReactTesting.addRenderContainer(this._testID, this);
    }
  }

  _hydrateId() {
    const nodes = document.querySelectorAll('[data-rendered-container-id]');
    if (nodes.length === 0) {
      return;
    }
    const lastNode = nodes[nodes.length - 1];
    const containerId = +lastNode.getAttribute('data-rendered-container-id');
    setID(containerId);
  }

  render() {
    if (REACT_16) {
      return [
        ReactDOM.createPortal(this.props.children, this._domContainer),
        <Portal key="portal-ref" rt_rootID={this._testID} />
      ];
    }
    return <Portal rt_rootID={this._testID} />;
  }

  componentDidMount() {
    if (!REACT_16) {
      this._renderChild();
    }
  }

  componentDidUpdate() {
    if (!REACT_16) {
      this._renderChild();
    }
  }

  componentWillUnmount() {
    if (!REACT_16) {
      ReactDOM.unmountComponentAtNode(this._domContainer);
    }
    if (this._domContainer.parentNode) {
      this._domContainer.parentNode.removeChild(this._domContainer);
    }

    if (window.ReactTesting) {
      window.ReactTesting.removeRenderContainer(this._testID);
    }
  }

  _renderChild() {
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      <RootContainer rt_portalID={this._testID}>
        {this.props.children}
      </RootContainer>,
      this._domContainer
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
class Portal extends React.Component<{ rt_rootID: number }> {
  render() {
    return <noscript data-render-container-id={this.props.rt_rootID} />;
  }
}

function RootContainer(props: { children?: React.Node }) {
  return React.Children.only(props.children);
}
