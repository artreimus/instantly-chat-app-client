import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import MessagesHeader from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages';
import NoConversationSelected from './NoConversationSelected';

interface FeedWrapperProps {
  session: Session | null;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;

  const userId = session?.user.id;

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
      width="100%"
      direction="column"
    >
      {conversationId && typeof conversationId === 'string' ? (
        <>
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
            height="100vh"
          >
            <MessagesHeader userId={userId!} conversationId={conversationId} />
            <Messages userId={userId!} conversationId={conversationId} />
          </Flex>
          <MessageInput session={session!} conversationId={conversationId} />
        </>
      ) : (
        <>
          <NoConversationSelected />
          <div>Hello World</div>
        </>
      )}
    </Flex>
  );
};
export default FeedWrapper;
