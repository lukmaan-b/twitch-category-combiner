import React from 'react';

const CategoryResults = ({ resultCategories, onSelectCategory }) => {
  const categoryListComponent = resultCategories.map((cat) => (
    <div
      style={styles.categoryContainer}
      key={cat.id}
      data-id={cat.id}
      onClick={onSelectCategory}
    >
      <p style={{ pointerEvents: 'none' }}>{cat.name}</p>
    </div>
  ));

  return (
    <div style={styles.container}>
      {resultCategories.length > 0 ? (
        categoryListComponent
      ) : (
        <h1>Search for some twitch categories</h1>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    margin: '2rem 0rem',
  },
  categoryContainer: {
    padding: '0.1rem 1rem',
    backgroundColor: '#eee',
    cursor: 'pointer',
  },
};

export default CategoryResults;
