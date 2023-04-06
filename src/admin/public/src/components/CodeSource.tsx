import { C_REPOSITORY } from '@/constants/repository';
import React from 'react';
import ExternalLink from './ExternalLink';

interface Props {
  provider: string;
  repo_url: string;
  repo_name: string;
  className?: string;
}

export default ({ provider, repo_url, repo_name, className = 'align-center' }: Props) => (
  <div className={className}>
    {C_REPOSITORY[provider as any]?.svg(16)}
    <ExternalLink
      className="color-link cursor-pointer ml-4"
      url={repo_url}
      label={repo_name}
    />
  </div>
)