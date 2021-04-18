import React, { useState, useEffect, useCallback } from 'react';
import display from './components/display';

import { useBottomScrollListener } from 'react-bottom-scroll-listener';

import './App.css';

const axios = require('axios').default;

function App() {
  const [data, setData] = useState({images: []});
  const [page, setPage] = useState("");

  useEffect(() => {
    axios.post('http://localhost:3001/images', {})
      .then(response => {
        setData({images: response.data.images});
        setPage(response.data.lastItem);
      });
  }, []);

  const handleOnDocumentBottom = useCallback(() => {
    console.log('I am at bottom! ' + Math.round(performance.now()));
    if (data.images.length === 0) {
      return
    }

    axios.post('http://localhost:3001/images', {lastItem: page})
      .then(response => {
        const nd = data.images.concat(response.data.images);
        setData({images: nd});
        setPage(response.data.lastItem);
      }).catch(err => {
        console.log('hit end');
      });
  }, [data.images, page]);
 
  useBottomScrollListener(handleOnDocumentBottom);

  return (
    <div className="App">
      <h1>Homepage</h1>
      {display(data.images ?? [])}
    </div>
  );
}

export default App;
