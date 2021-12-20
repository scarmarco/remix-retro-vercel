import { useLoaderData, useParams } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { gql, GraphQLClient } from 'graphql-request'

import Card from "~/components/Card";
const endpoint = 'https://3k5q3ochfnaxngc2oxr37ioemu.appsync-api.eu-west-1.amazonaws.com/graphql'

const query = gql`
  query getBoard($boardId: ID!) {
    getBoardById(boardId: $boardId) {
      id
      stage
      team
    }
  }
`
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'x-api-key': process.env.API_KEY || '',
  },
})

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.boardId, "Expected params.boardId");
  const data = await graphQLClient.request(query, params)
  console.log(JSON.stringify(data, undefined, 2))
  return null
}

const items = [
  { id: 1, text: "some" },
  { id: 2, text: "other" },
  { id: 3, text: "new" },
];

export default function BoardRoute() {
  const board = useLoaderData();
  const params = useParams();

  return (
    <div className="flex h-full p-3 bg-gray-300 gap-3">
      <div className="flex-1">
        <Card placeholder="It worked" items={items} />
      </div>
      <div className="flex-1">
        <Card placeholder="To improve" />
      </div>
      <div className="flex-1">
        <Card placeholder="To ask" />
      </div>
      <div className="flex-1">
        <Card placeholder="To do" />
      </div>
    </div>
  );
}
