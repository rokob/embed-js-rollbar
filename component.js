import React from 'react';
import ReactDOM from 'react-dom';
import rollbar from 'rollbar/dist/rollbar.noconflict.umd';
import { wrap } from './utility';

(function() {
  let token = '59c9582c45d945f0ad2b7c3dc1aa9813';
  let Rollbar = new rollbar({
      accessToken: token,
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
          environment: "some-embedded-component",
          context: {
            appName: 'guest-context',
          }
      },
      autoInstrument: { log: false },
  });

  // This is just an example of maybe how to make wrapping a little easier
  let wrapper = function(f) {
    return wrap(Rollbar, 'guest', f);
  };

  // Using this error boundary will cause most errors to be reported only to
  // this Rollbar instance and will stop them from propagating to the global
  // onerror handler and therefore the host will not know about these
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      Rollbar.error(error, info);
    }

    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
      return this.props.children;
    }
  }

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = { broken: false };
      // Wrapping the event handlers provides a mechanism for associating context
      // with any errors that might happen within them
      this.handle = wrapper(this.handle.bind(this));
      this.renderBad = wrapper(this.renderBad.bind(this));
    }

    // React Error Boundaries do not work for event handlers, for similar reasons there
    // isn't a good way to pass the context of where this error happened along with
    // an uncaught exception
    handle(e) {
      e.preventDefault();
      throw new Error("Bork the bork!!!");
    }

    renderBad() {
      this.setState({ broken: true });
    }

    render() {
      if (this.state.broken) {
        throw new Error("Rendering is broken");
      }
      return (
        <div>
          <h1>Hello world!!</h1>
          <button onClick={this.handle}>Break it</button>
          <button onClick={this.renderBad}>Break rendering</button>
        </div>
      )
    }
  };

  ReactDOM.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
    document.getElementById('component')
  );
})();
