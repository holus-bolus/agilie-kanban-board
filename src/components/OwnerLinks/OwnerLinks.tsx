
import React from 'react';

interface OwnerLinksProps {
    owner: string;
    repoUrl: string;
}

const OwnerLinks: React.FC<OwnerLinksProps> = ({ owner, repoUrl }) => {
    return (
        <div>
            <a href={`https://github.com/${owner}`}>Owner Profile</a>
            {' | '}
            <a href={repoUrl}>Repository</a>
        </div>
    );
};

export default OwnerLinks;
