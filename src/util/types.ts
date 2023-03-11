// Typescript interfaces for GraphQL mutation return type
export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

// Typescript interfaces for GraphQL mutation paramter variable type
export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchedUser {
  id: string;
  username: string;
}
