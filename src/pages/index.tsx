import Auth from '@/components/Auth';
import Chat from '@/components/Chat';
import { Box } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Home() {
  const { data: session } = useSession();

  const reloadSession = () => {
    console.log('Reloading');
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  console.log('session', session);

  return (
    <>
      <Head>
        <title>Instantly</title>
        <meta name="description" content="A real time chat application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        {session?.user.username ? (
          <Chat session={session} />
        ) : (
          <Auth session={session} reloadSession={reloadSession} />
        )}
      </Box>
    </>
  );
}

// We don't have access to client side hooks here because we are in the server
export async function getServerSideProps(context: NextPageContext) {
  // Fetch user session using SSR
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
