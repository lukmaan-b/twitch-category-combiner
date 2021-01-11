require('dotenv').config();

const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { categoryType, streamType } = require('./graphqlTypes');

const PORT = process.env.PORT || 5000;

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    category: {
      type: GraphQLList(categoryType),
      args: {
        categoryInput: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        const q = encodeURIComponent(args.categoryInput);
        const {
          data: { data },
        } = await axios.get(
          `https://api.twitch.tv/helix/search/categories?query=${q}`,
          {
            headers: {
              accept: 'application/vnd.twitchtv.v5+json',
              'Client-ID': process.env.CLIENT_ID,
              Authorization: `Bearer ${authPayload.access_token}`,
            },
          }
        );

        return data;
      },
    },
    streams: {
      type: GraphQLList(GraphQLList(streamType)),
      args: {
        game_ids: { type: GraphQLList(GraphQLString) },
      },
      resolve: async (root, { game_ids }) => {
        let data = [];

        if (game_ids) {
          for (
            let i = 0;
            i < (game_ids.length > 5 ? 5 : game_ids.length);
            i++
          ) {
            const {
              data: { data: streams },
            } = await axios.get(
              `https://api.twitch.tv/helix/streams?game_id=${encodeURIComponent(
                game_ids[i]
              )}&first=5`,
              {
                headers: {
                  accept: 'application/vnd.twitchtv.v5+json',
                  'Client-ID': process.env.CLIENT_ID,
                  Authorization: `Bearer ${authPayload.access_token}`,
                },
              }
            );
            data.push(streams);
          }
        } else {
          const {
            data: { data: streams },
          } = await axios.get(`https://api.twitch.tv/helix/streams?&first=5`, {
            headers: {
              accept: 'application/vnd.twitchtv.v5+json',
              'Client-ID': process.env.CLIENT_ID,
              Authorization: `Bearer ${authPayload.access_token}`,
            },
          });
          data.push(streams);
        }

        return data;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: queryType });

let authPayload = {
  access_token: null,
  expires_in: 0,
  token_type: null,
};

const checkAuthToken = async (req, res, next) => {
  const currDate = new Date();
  const authExpDate = new Date(
    currDate.getTime() + authPayload.expires_in * 1000
  );

  if (authExpDate > currDate) {
    next();
  } else {
    console.log('new auth created');
    const { data } = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`
    );
    authPayload = data;
    next();
  }
};

app.use(express.json());
app.use(express.urlencoded());

app.use(checkAuthToken);

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log('Listening on ' + PORT));
