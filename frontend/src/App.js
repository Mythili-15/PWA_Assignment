import React from 'react';
import TextInput from './TextInput';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ textAlign: 'center' }}>Text Ngram Explorer</h1>
      </header>
      <main>
        <TextInput />
      </main>
    </div>
  );
}

export default App;
