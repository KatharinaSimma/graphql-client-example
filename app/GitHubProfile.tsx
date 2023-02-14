'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import { useState } from 'react';
import { GitHubProfileResponse } from './page';

const githubQuery = gql`
  query profileQuery($name: String!) {
    user(login: $name) {
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
`;

export default function GitHubProfile() {
  const [username, setUsername] = useState('');

  const { loading, error, data, refetch } = useQuery<GitHubProfileResponse>(
    githubQuery,
    {
      variables: {
        name: 'prochaLu',
      },
    },
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error! ${error.message}`}</div>;
  if (!data) return <div>No data</div>;

  console.log('data', data);
  return (
    <div>
      <input
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
      />
      <button
        onClick={async () => {
          await refetch({ name: username });
        }}
      >
        Get Profile
      </button>
      <h1>{data.user.name}'s Profile</h1>
      <Image
        src={data.user.avatarUrl}
        alt={`${data.user.name}'s avatar`}
        width="400"
        height="400"
      />
      <h2>Repositories</h2>
      {data.user.repositories.edges.map((repository) => (
        <li key={`repository-${repository.node.id}`}>{repository.node.name}</li>
      ))}
    </div>
  );
}
