import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './List';

interface ConversationsWrapperProps {
  session: Session | null;
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({
  session,
}) => {
  return (
    <Box
      width={{ base: '100%', md: '400px' }}
      border="1px solid red"
      bg="blackAlpha.50"
      py={6}
      px={3}
    >
      {/* Skeleton Loader */}
      <ConversationList session={session} />
    </Box>
  );
};
export default ConversationsWrapper;
