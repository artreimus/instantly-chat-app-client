import React, { useState } from 'react';
import { Button, Center, Stack, Text, Image, Input } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import UserOperations from '@/graphql/operations/user';
import { CreateUsernameData, CreateUsernameVariables } from '@/util/types';
import toast from 'react-hot-toast';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({
  session,
  reloadSession,
}) => {
  const [username, setUsername] = useState('');

  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;

    try {
      const { data } = await createUsername({ variables: { username } });
      if (!data?.createUsername) throw new Error();

      if (data?.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success('Username successfully created!');
      // Reload session to obtain new username
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);

      console.error('Auth - onSubmit', error);
    }
  };

  return (
    <Center height="100vh">
      <Stack align="center" spacing={4}>
        {session ? (
          <>
            <Text fontSize="3xl">Create a username</Text>
            <Input
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={() => onSubmit()} width="100%" isLoading={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">MessengerQL</Text>
            <Button
              onClick={() => signIn('google')}
              leftIcon={
                <Image
                  height="20px"
                  src="/images/googlelogo.png"
                  alt="Google logo"
                />
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
