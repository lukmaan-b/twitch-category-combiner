import React from 'react';
import Streams from './Streams';
import './styles/selectedCategories.css';
const CategoryResults = ({ selectedCategories, onDeleteCategory }) => {
  const categoryListComponent = selectedCategories.map((cat) => (
    <div className="categoryContainer" key={cat.id}>
      <img
        className="image"
        src={cat.box_art_url.replace('52x72', '300x400')}
        alt="box art"
      />
      <button
        className="close-button"
        data-id={cat.id}
        onClick={onDeleteCategory}
      >
        ❌
      </button>
    </div>
  ));

  return (
    selectedCategories.length > 0 && (
      <div className="category-list__container">{categoryListComponent}</div>
    )
  );
};

export default CategoryResults;
