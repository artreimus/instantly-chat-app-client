import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './List';
import { useQuery } from '@apollo/client';
import ConversationOperations from '../../../graphql/operations/conversation';
import { ConversationsData } from '@/util/types';

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
  } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);

  console.log('Here is data', conversationsData);

  return (
    <Box width={{ base: '100%', md: '400px' }} bg="blackAlpha.50" py={6} px={3}>
      {/* Skeleton Loader */}
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
      />
    </Box>
  );
};
export default ConversationsWrapper;
