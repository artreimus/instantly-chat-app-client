import { ConversationPopulatedFE } from '@/util/types';
import { Stack, Text } from '@chakra-ui/react';

interface ConversationItemProps {
  conversation: ConversationPopulatedFE;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
}) => {
  return (
    <Stack border="1px solid red">
      <Text>{conversation.id}</Text>
    </Stack>
  );
};
export default ConversationItem;
