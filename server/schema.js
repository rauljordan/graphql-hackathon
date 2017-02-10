export default `
type Query {
  getTodoItems: [TodoItem]
}

type TodoItem {
  _id: ID
  title: String
}

schema {
  query: Query
}
`;
