import React from 'react';
import { Link } from 'gatsby';
import Layout from '@/components/Layout';
import { useAuth } from '@/providers/AuthProvider';

const IndexPage: React.FC = () => {
  const { session } = useAuth();
  return (
    <Layout>
      <h1>Hello {session ? session.user.email : 'world'}!</h1>
      <p>
        {session ? (
          <>
            You are logged in, so check your <Link to="/app/profile">profile</Link>
          </>
        ) : (
          <>
            You should <Link to="/app/login">log in</Link> to see restricted content
          </>
        )}
      </p>
    </Layout>
  );
};

export default IndexPage;
