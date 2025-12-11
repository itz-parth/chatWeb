import React from 'react';
import IncomingRequestsList from './IncomingRequestsList';
import OutgoingRequestsList from './OutgoingRequestsList';
import FriendsListItems from './FriendsListItems';

const FriendList = () => {
    return (
        <div className="space-y-6 py-2">
            <IncomingRequestsList />
            <OutgoingRequestsList />
            <FriendsListItems />
        </div>
    );
};

export default FriendList;
