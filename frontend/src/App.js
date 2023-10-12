import React from 'react';

function App() {
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <h1>共助アプリ認証</h1>
      <button
        type="button"
        className="btn btn-lg btn-default"
        onClick={() => {
          // ボタンがクリックされたときに指定されたURLに遷移
          window.location.href = '/login';
        }}
      >
        LINEログイン
      </button>
      <h1>フロントエンド</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
