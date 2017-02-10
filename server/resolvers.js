export default {
  Query: {
    getTodoItems(root, args, context) {
      return [
        {
          _id: '12345',
          title: 'Buy Groceries'
        },
        {
          _id: '232032',
          title: 'Win Hackathon'
        }
      ];
    }
  }
};
