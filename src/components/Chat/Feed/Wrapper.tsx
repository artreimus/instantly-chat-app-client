import { Session } from 'next-auth';

interface FeedWrapperProps {
  session: Session | null;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  return <div>Feed Wrapper</div>;
};
export default FeedWrapper;
