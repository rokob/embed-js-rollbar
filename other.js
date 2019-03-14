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
          environment: "other-embedded-component",
          context: {
            appName: 'other',
          }
      }
  });

  const App = () => {
    function handle(e) {
      // here I do the wrapping inline inside the function, noting that wrap returns
      // a function so inside here I have to call it to get this handler to do what
      // we want. This isn't a great looking solution but this is also a toy example.
      wrap(Rollbar, 'other', function() {
        e.preventDefault();
        throw new Error("All the bork are belong to us!!");
      })();
    }

    return (
      <div>
        <h1>Howdy earth!!</h1>
        <button onClick={handle}>Bork it</button>
      </div>
    )
  };

  ReactDOM.render(
    <App />,
    document.getElementById('other')
  );
})();
