const { GraphQLObjectType, GraphQLString } = require('graphql');

const streamType = new GraphQLObjectType({
  name: 'Stream',
  fields: {
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    game_name: { type: GraphQLString },
    user_name: { type: GraphQLString },
    title: { type: GraphQLString },
    language: { type: GraphQLString },
    thumbnail_url: { type: GraphQLString },
  },
});

const categoryType = new GraphQLObjectType({
  name: 'Category',
  fields: {
    id: { type: GraphQLString },
    box_art_url: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

module.exports = { streamType, categoryType };
