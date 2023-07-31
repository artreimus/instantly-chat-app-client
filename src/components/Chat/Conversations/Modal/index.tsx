import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import UserOperations from '@/graphql/operations/user';
import {
  CreateConversationData,
  CreateConversationInput,
  SearchedUser,
  SearchUsersData,
  SearchUsersInput,
} from '@/util/types';
import UserSearchList from './UserSearchList';
import Participants from './Participants';
import { toast } from 'react-hot-toast';
import ConversationOperations from '@/graphql/operations/conversation';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { create } from 'domain';

interface ConversationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const ConversationsModal: React.FC<ConversationsModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

  // useLazyQuery instead of useQuery to not execute the query when the component renders
  const [searchUsers, { data, error, loading: searchedUsersloading }] =
    useLazyQuery<SearchUsersData, SearchUsersInput>(
      UserOperations.Queries.searchUsers
    );

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // searchUsers doesn't have be explicitly set as async
    // useLazyQuery handles the Promise for us
    searchUsers({ variables: { username } });
  };

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutations.createConversation
    );

  const onCreateConversation = async () => {
    if (!session?.user.id) return;
    const participantIds = [
      session.user.id,
      ...participants.map((participant) => participant.id),
    ];

    try {
      const { data, errors } = await createConversation({
        variables: { participantIds },
      });

      if (!data?.createConversation || errors) {
        throw new Error('Failed to create conversation');
      }

      const {
        createConversation: { conversationId },
      } = data;

      // Clear state and close modal on successful creation
      setParticipants([]);
      setUsername('');
      onClose();

      router.push({ query: { conversationId } });
    } catch (error: any) {
      console.error('onCreateConversation', error);
      toast.error(error?.message);
    }
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) =>
      prev.filter((participant) => participant.id !== userId)
    );
    setUsername('');
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  type="submit"
                  isDisabled={!username}
                  isLoading={searchedUsersloading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipants={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: 'brand.100' }}
                  color="#FFFFFF"
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}
                >
                  Create conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ConversationsModal;
