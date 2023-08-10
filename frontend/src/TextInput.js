import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { submitText, getConnectionCount } from './api';
import './styles.css';

const TextInput = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [recentStrings, setRecentStrings] = useState([]);
  const [ngramResults, setNgramResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showRecentStrings, setShowRecentStrings] = useState(false);
  const [showNgramResults, setShowNgramResults] = useState(false);
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/submit-text',
        { text: inputText }
      );
      setResult(response.data.result);
      setSubmitted(true);
      const textDataResponse = await axios.post(
        'http://localhost:3000/api/submit-text-data',
        { text: inputText }
      );
      await axios.get('http://localhost:3000/api/log-connection');
      const connectionCount = await getConnectionCount();
      console.log('Number of connections:', connectionCount);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRecentStrings = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/get-recent-strings'
      );
      setRecentStrings(response.data.recentStrings);
      setShowRecentStrings(true);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchNgrams = async () => {
    try {
      console.log('Recent Strings:', recentStrings);
      const response = await axios.post(
        'http://localhost:8000/api/process-ngrams',
        {
          strings: recentStrings,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.ngram_results);
      setNgramResults(response.data.ngram_results);
      setShowNgramResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="form-section">
        <TextField
          label="Enter Text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="wide-text-input"
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <div className={`output-section ${submitted ? 'show-result' : ''}`}>
        <div className={`result ${submitted ? 'result-background' : ''}`}>
          {result}
        </div>
      </div>
      <div className="action-buttons">
        <Button variant="contained" onClick={fetchRecentStrings}>
          Get Recent 2 Strings
        </Button>
        <Button variant="contained" onClick={fetchNgrams}>
          Process Ngrams
        </Button>
      </div>
      {showRecentStrings && (
        <div className="result-box">
          <h2>Recent 2 Strings:</h2>
          <ul className="bullet-list">
            {recentStrings.map((recentString, index) => (
              <li className="recent-item" key={index}>
                {recentString}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showNgramResults && (
        <div className="result-box ngram-result-box">
          <h2>Ngram Comparison Results:</h2>
          <div className="ngram-result-container">
            {ngramResults.map((ngramResult, index) => (
              <div className="ngram-result-item" key={index}>
                <div className="similarity">
                  {ngramResult.similarities.map(
                    (similarity, similarityIndex) => (
                      <div className="similarity-item" key={similarityIndex}>
                        <strong>
                          Similarity between 2 Strings : {similarity.toFixed(2)}
                        </strong>
                      </div>
                    )
                  )}
                </div>
                {ngramResult.ngram_data.map((ngramData, dataIndex) => (
                  <div className="ngram-data" key={dataIndex}>
                    <div className="ngram-set-box">
                      <h4>N-gram Set 1:</h4>
                      <ul>
                        {ngramData.ngram_set1.map((ngram, ngramIndex) => (
                          <li key={ngramIndex}>{ngram}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="ngram-set-box">
                      <h4>N-gram Set 2:</h4>
                      <ul>
                        {ngramData.ngram_set2.map((ngram, ngramIndex) => (
                          <li key={ngramIndex}>{ngram}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="ngram-set-box common-ngram-box">
                      <h4>Common N-grams:</h4>
                      <ul className="common-ngram-list">
                        {ngramData.common_ngrams.map((ngram, ngramIndex) => (
                          <li key={ngramIndex}>{ngram}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextInput;
