import React from 'react';

interface OwnerLinksProps {
    owner: string;
    repoUrl: string;
}

const OwnerLinks: React.FC<OwnerLinksProps> = ({ owner, repoUrl }) => {
    const repoOwner = repoUrl.startsWith(`${owner}/`) ? '' : `${owner}/`;
    const githubRepoUrl = `https://github.com/${repoOwner}${repoUrl}`;

    return (
        <div>
            <a href={`https://github.com/${owner}`} target="_blank" rel="noopener noreferrer">Owner Profile</a>
            {' | '}
            <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer">Repository</a>
        </div>
    );
};

export default OwnerLinks;
