import { Button, Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import * as React from 'react';
import ConversationsWrapper from './Conversations/Wrapper';
import FeedWrapper from './Feed/Wrapper';

interface ChatProps {
  session: Session | null;
}

const Chat: React.FunctionComponent<ChatProps> = ({ session }) => {
  return (
    <Flex height="100vh">
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
};

export default Chat;
