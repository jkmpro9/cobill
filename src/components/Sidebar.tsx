import React, { useState } from 'react';
import { Home, Users, FileText, BarChart2, MessageSquare, Settings, Shield, ChevronDown, ChevronUp, UserPlus, List } from 'lucide-react';

interface MenuItem {
  icon: React.ElementType;
  text: string;
  path: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: Home, text: 'Overview', path: '/' },
  { icon: BarChart2, text: 'Statistics', path: '/statistics' },
  { 
    icon: Users, 
    text: 'Customers', 
    path: '/customers',
    subItems: [
      { icon: UserPlus, text: 'Add Customer', path: '/customers/add' },
      { icon: List, text: 'Customer List', path: '/customers/list' },
    ]
  },
  { icon: FileText, text: 'Invoices', path: '/invoices' },
  { icon: MessageSquare, text: 'Messages', path: '/messages' },
];

const generalItems: MenuItem[] = [
  { icon: Settings, text: 'Settings', path: '/settings' },
  { icon: Shield, text: 'Security', path: '/security' },
];

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath, onNavigate }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (path: string) => {
    setExpandedItem(expandedItem === path ? null : path);
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = activePath.startsWith(item.path);
    const isExpanded = expandedItem === item.path;

    return (
      <div key={index}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (item.subItems) {
              toggleExpand(item.path);
            } else {
              onNavigate(item.path);
            }
          }}
          className={`flex items-center justify-between py-2 px-4 text-gray-300 hover:bg-green-800 rounded ${
            isActive ? 'bg-green-800' : ''
          }`}
        >
          <div className="flex items-center">
            <item.icon className="mr-3 h-5 w-5" />
            {item.text}
          </div>
          {item.subItems && (
            isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </a>
        {item.subItems && isExpanded && (
          <div className="ml-6 mt-2 space-y-2">
            {item.subItems.map((subItem, subIndex) => (
              <a
                key={subIndex}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(subItem.path);
                }}
                className={`flex items-center py-2 px-4 text-gray-300 hover:bg-green-800 rounded ${
                  activePath === subItem.path ? 'bg-green-800' : ''
                }`}
              >
                <subItem.icon className="mr-3 h-4 w-4" />
                {subItem.text}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-green-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <span className="text-2xl font-bold">COCCINELLE SARL</span>
      </div>
      <nav>
        <p className="text-gray-400 mb-2">MENU</p>
        {menuItems.map(renderMenuItem)}
        <p className="text-gray-400 mt-8 mb-2">GENERAL</p>
        {generalItems.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default Sidebar;