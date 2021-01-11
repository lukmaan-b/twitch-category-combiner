import { useEffect, useState } from 'react';

import axios from 'axios';

import CategoryResults from './components/CategoryResults';
import SelectedCategories from './components/SelectedCategories';
import Streams from './components/Streams';

import './components/styles/search.css';

function App() {
  const [categoryInput, setCategoryInput] = useState('');
  const [resultCategories, setResultCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const onSelectCategory = (e) => {
    const category = resultCategories.find((c) => c.id === e.target.dataset.id);
    if (
      category &&
      selectedCategories.indexOf(category) === -1 &&
      selectedCategories.length <= 5
    ) {
      setSelectedCategories((prevState) => [...prevState, category]);
    }
  };

  const onDeleteCategory = (e) => {
    setSelectedCategories((prevState) =>
      prevState.filter((c) => c.id !== e.target.dataset.id)
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const query = `query category($categoryInput: String!) {
      category(categoryInput: $categoryInput){
        name 
        id
        box_art_url
      }
    }`;
    const {
      data: {
        data: { category },
      },
    } = await axios.post(
      'http://localhost:5000/graphql',
      JSON.stringify({ query, variables: { categoryInput } }),
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    setResultCategories(category);
  };
  return (
    <div className="App">
      <form className="search" method="post" onSubmit={onSubmit}>
        <input
          type="text"
          value={categoryInput}
          onChange={({ target: { value } }) => setCategoryInput(value)}
        />
        <button>🔎</button>
      </form>
      <CategoryResults
        resultCategories={resultCategories}
        onSelectCategory={onSelectCategory}
      />

      <SelectedCategories
        selectedCategories={selectedCategories}
        onDeleteCategory={onDeleteCategory}
      />
      <Streams selectedCategories={selectedCategories} />
    </div>
  );
}

export default App;
