import { gql } from '@apollo/client';
import { initializeApollo } from '../util/client';
import ApolloClientProvider from './ApolloClientProvider';
import GithubProfile from './GitHubProfile';

export type GitHubProfileResponse = {
  user: {
    name: string;
    avatarUrl: string;
    repositories: {
      edges: {
        node: {
          name: string;
          id: string;
        };
      }[];
    };
  };
};

export default async function HomePage() {
  const client = initializeApollo(null);

  await client.query<GitHubProfileResponse>({
    query: gql`
      query profileQuery($username: String = "prochaLu") {
        user(login: $username) {
          name
          avatarUrl
          repositories(last: 10) {
            edges {
              node {
                id
                name
                defaultBranchRef {
                  name
                }
              }
            }
          }
        }
      }
    `,
  });

  return (
    <main>
      <ApolloClientProvider
        initialApolloState={JSON.stringify(client.cache.extract())}
      >
        <GithubProfile />
      </ApolloClientProvider>
    </main>
  );
}
