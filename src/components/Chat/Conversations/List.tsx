import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import ConversationsModal from './Modal';
import { ConversationPopulated } from '@/util/types';
import ConversationItem from './Item';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  // Destructuring not working so assign to variable instead
  const userId = session?.user.id;

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Box width="100%">
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
      {conversations.map((conversation) => {
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
          />
        );
      })}
    </Box>
  );
};
export default ConversationList;
