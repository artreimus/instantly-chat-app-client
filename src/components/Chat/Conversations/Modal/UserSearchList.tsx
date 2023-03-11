import { SearchedUser } from '@/util/types';
import { Stack, Text, Flex, Avatar, Button } from '@chakra-ui/react';
import React from 'react';

interface UserSearchListProps {
  users: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  users,
  addParticipant,
}) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center" fontWeight={500}>
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              direction="row"
              key={user.id}
              align="center"
              spacing={4}
              py={2}
              px={4}
              borderRadius={4}
              _hover={{ bg: 'blackAlpha.100' }}
            >
              <Avatar />
              <Flex justify="space-between" align="center" width="100%">
                <Text color="blackAlpha.900">{user.username}</Text>
                <Button
                  bg="brand.100"
                  color="#FFFFFF"
                  _hover={{ bg: 'brand.100', opacity: '0.9' }}
                  onClick={() => addParticipant(user)}
                >
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};
export default UserSearchList;
