import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/stream.css';
const Streams = ({ selectedCategories }) => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    (async () => {
      const game_ids = selectedCategories.map((cat) => cat.id);

      let query = '';

      if (game_ids.length > 0) {
        query = `query streams($game_ids: [String]) {
          streams(game_ids: $game_ids){
            id
            user_id
            game_name
            user_name
            title
            language
            thumbnail_url
            viewer_count
          }
        }`;
      } else {
        query = `query streams {
          streams{
            id
            user_id
            game_name
            user_name
            title
            language
            thumbnail_url
            viewer_count
          }
        }`;
      }

      const {
        data: {
          data: { streams: data },
        },
      } = await axios.post(
        'http://localhost:5000/graphql',
        JSON.stringify({ query, variables: { game_ids } }),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      setStreams(data);
    })();
  }, [selectedCategories]);

  const streamListComponent = streams.map((streamBatch, i) => (
    <section className="stream__container" key={i}>
      {selectedCategories.length === 0 ? null : streamBatch[0] ? (
        <h3>{streamBatch[0].game_name}</h3>
      ) : null}
      {streamBatch.map((s) => (
        <a key={s.id} href={`http://twitch.tv/${s.user_name}`}>
          <div className="stream">
            <div className="streamImage">
              <img
                src={s.thumbnail_url.replace('{width}x{height}', '350x200')}
                alt="stream thumbnail"
              />
            </div>

            <h3 id="stream-title">{s.title}</h3>
            <p>{s.user_name}</p>

            <div className="tags">
              <span>Language: {s.language}</span>{' '}
              <span>
                {new Intl.NumberFormat('GB').format(s.viewer_count)} viewers
              </span>
            </div>
          </div>
        </a>
      ))}
    </section>
  ));

  return (
    streamListComponent && (
      <div className="stream-list-component">{streamListComponent}</div>
    )
  );
};

export default Streams;
