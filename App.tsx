/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LiveAPIProvider } from './contexts/LiveAPIContext';
import EburonApp from './EburonApp';
import { GooglePicker } from './components/GooglePicker';

function App() {
  return (
    <LiveAPIProvider>
      <EburonApp />
      <GooglePicker />
    </LiveAPIProvider>
  );
}

export default App;
