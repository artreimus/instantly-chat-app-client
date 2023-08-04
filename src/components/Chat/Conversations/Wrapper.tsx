import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './List';
import { useQuery } from '@apollo/client';
import ConversationOperations from '../../../graphql/operations/conversation';
import { ConversationPopulated, ConversationsData } from '@/util/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ConversationsWrapperProps {
  session: Session | null;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);

  const router = useRouter();

  const { conversationId } = router.query;

  const onViewConversation = async (conversationId: string) => {
    // Push the conversationId to the router query params
    router.push({ query: { conversationId } });
    // Mark the conversation as read
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      // Whatever is returned from updateQuery will be our new data
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        // If no new data, just return prev data
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        let flag = false;

        prev?.conversations.every((conversation) => {
          if (conversation.id === newConversation.id) {
            flag = true;
          }
          return !flag;
        });

        if (flag) return;
        // Prepend new data
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev?.conversations],
        });
      },
    });
  };

  // Execute subscription on mount
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}
      width={{ base: '100%', md: '400px' }}
      bg="blackAlpha.50"
      py={6}
      px={3}
    >
      {/* Skeleton Loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};
export default ConversationsWrapper;
