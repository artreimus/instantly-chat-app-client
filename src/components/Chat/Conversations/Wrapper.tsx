import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './List';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import ConversationOperations from '../../../graphql/operations/conversation';
import {
  ConversationCreatedSubscriptionData,
  ConversationDeletedData,
  ConversationPopulated,
  ConversationUpdatedData,
  ConversationsData,
  ParticipantPopulated,
} from '@/util/types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SkeletonLoader from '@/components/common/SkeletonLoader';

interface ConversationsWrapperProps {
  session: Session | null;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const { conversationId } = router.query;

  const userId = session?.user.id;

  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId?: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  useSubscription<ConversationUpdatedData>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;

        const currentlyViewingConversation =
          conversationId === updatedConversation.id;

        if (currentlyViewingConversation)
          // update db and do optimistic rendering
          onViewConversation(conversationId, false);
      },
    }
  );

  useSubscription<ConversationDeletedData>(
    ConversationOperations.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;
        console.log(data);

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
        });

        if (!existing) return;

        const { conversations } = existing;

        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });

        router.push('/');
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage?: boolean
  ) => {
    // Pushing the conversationId to the router query params
    router.push({ query: { conversationId } });
    // Marking the conversation as read
    if (hasSeenLatestMessage) return;

    // markConversation mutation
    try {
      await markConversationAsRead({
        variables: { userId, conversationId },
        optimisticResponse: { markConversationAsRead: true },
        update: (cache) => {
          // Get Conversation Participants from Cache
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIndex = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (userParticipantIndex === -1) return;

          const userParticipant = participants[userParticipantIndex];

          participants[userParticipantIndex] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          // Update cache
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: { participants },
          });
        },
      });
    } catch (error) {
      console.log('onViewConversation error', error);
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      // Whatever is returned from updateQuery will be our new data
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        // If no new data, just return prev data
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        let flag = false;

        prev.conversations.every((conversation) => {
          if (conversation.id === newConversation.id) {
            flag = true;
          }
          return !flag;
        });

        if (flag) return prev;

        // Prepend new data
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
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
      bg="whiteAlpha.50"
      py={6}
      px={3}
      flexDirection="column"
      gap={4}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" width="100" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};
export default ConversationsWrapper;
