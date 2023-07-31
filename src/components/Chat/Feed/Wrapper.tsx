import { Flex } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface FeedWrapperProps {
  session: Session | null;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;

  return (
    <Flex
      display={{ base: conversationId ? 'flex' : 'none' }}
      border="1px solid red"
      width="100%"
      direction="column"
    >
      {conversationId ? <Flex></Flex> : <></>}
    </Flex>
  );
};
export default FeedWrapper;
