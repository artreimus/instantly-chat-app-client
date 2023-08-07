import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import ConversationsModal from './Modal';
import { ConversationPopulated } from '@/util/types';
import ConversationItem from './Item';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import ConversationOperations from '@/graphql/operations/conversation';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';

interface ConversationListProps {
  session: Session | null;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage?: boolean
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deleteConversation] = useMutation(
    ConversationOperations.Mutations.deleteConversation
  );
  const router = useRouter();

  // Destructuring not working so assign to variable instead
  const userId = session?.user.id;

  const onDeleteConversation = async (conversationId: string) => {
    console.log('trying to delete');
    try {
      toast.promise(
        deleteConversation({
          variables: { conversationId },
          update: () => {
            // just to satisfy typescript
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === 'string'
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ''
            );
          },
        }),
        {
          loading: 'Deleting conversation',
          success: <b>Conversation Deleted</b>,
          error: <b>Failed to delete conversation</b>,
        }
      );
    } catch (error) {
      console.log('onDeleteConversation error', error);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Box width="100%" position="relative" height="100%" overflow="hidden">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="whiteAlpha.900"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center" color="blackAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Box>
      <ConversationsModal isOpen={isOpen} onClose={onClose} session={session} />
      <Flex gap={1} direction="column">
        {sortedConversations.map((conversation) => {
          const participant = conversation.participants.find(
            (p) => p.user.id === userId
          );

          const hasSeenLatestMessage = participant?.hasSeenLatestMessage;

          return (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={() =>
                onViewConversation(conversation.id, hasSeenLatestMessage)
              }
              isSelected={conversation.id === router.query.conversationId}
              userId={userId}
              hasSeenLatestMessage={hasSeenLatestMessage}
              onDeleteConversation={onDeleteConversation}
            />
          );
        })}
      </Flex>
      <Box position="absolute" bottom={0} left={0} width="100%" px={5} py={3}>
        <Button width="100%" onClick={() => signOut()}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};
export default ConversationList;
