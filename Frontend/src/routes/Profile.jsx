import React from 'react';
import { useUser } from '../context/User.Context';

const Profile = () => {
  const { user, userError, userLoading } = useUser();

  if (userLoading) {
    return <p>Loading profile...</p>;
  }

  if (userError) {
    return <p>Error fetching profile: {error.message}</p>;
  }

  return (
    <>
    <div>
      
      </div>
    </>
  );
};

export default Profile;
