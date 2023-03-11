import { SearchedUser } from '@/util/types';
import { Flex, Stack, Text } from '@chakra-ui/react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipants: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipants,
}) => {
  console.log('Here are participants', participants);
  return (
    <Flex mt={4} gap="10px" flexWrap="wrap">
      {participants.map((participant) => (
        <Stack
          direction="row"
          key={participant.id}
          align="center"
          bg="blackAlpha.100"
          borderRadius={4}
          p={2}
        >
          <Text>{participant.username}</Text>
          <IoIosCloseCircleOutline
            size={20}
            cursor="pointer"
            onClick={() => removeParticipants(participant.id)}
          />
        </Stack>
      ))}
    </Flex>
  );
};
export default Participants;
