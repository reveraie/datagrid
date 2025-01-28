import React from 'react';

export interface TabProps {
  label: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Tab;