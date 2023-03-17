import React from 'react';
import { ResponsiveGrid } from '@alicloud/console-components';
import PageHeader from '@/components/PageHeader';
const { Cell } = ResponsiveGrid;

interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumbs: object;
  title?: string;
  breadcrumbExtra?: React.ReactNode;
  hideBackground?: boolean;
  subhead?: React.ReactNode;
  description?: string;
}

const PageLayout = ({
  children,
  breadcrumbs,
  title,
  breadcrumbExtra,
  hideBackground = false,
  subhead,
  description,
}: PageLayoutProps) => {
  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        <PageHeader
          breadcrumbs={breadcrumbs}
          title={title}
          breadcrumbExtra={breadcrumbExtra}
          subhead={subhead}
          description={description}
        />
      </Cell>
      <Cell colSpan={12}>
        <div
          className="page-content"
          style={{ backgroundColor: hideBackground ? 'transparent' : '#fff' }}
        >
          {children}
        </div>
      </Cell>
    </ResponsiveGrid>
  );
};

export default PageLayout;
