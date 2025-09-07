import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, placeholder = "Search community posts..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch(searchQuery?.trim());
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="mb-6">
      {/* Mobile Search Toggle */}
      <div className="md:hidden">
        {!isExpanded ? (
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="w-full justify-start text-muted-foreground"
          >
            <Icon name="Search" size={18} className="mr-2" />
            {placeholder}
          </Button>
        ) : (
          <div className="bg-card border border-border rounded-lg p-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pr-10"
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                )}
              </div>
              <Button type="submit" size="icon">
                <Icon name="Search" size={18} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
              >
                <Icon name="X" size={18} />
              </Button>
            </form>
          </div>
        )}
      </div>
      {/* Desktop Search */}
      <div className="hidden md:block">
        <div className="bg-card border border-border rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Icon
                name="Search"
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  <Icon name="X" size={16} />
                </Button>
              )}
            </div>
            <Button type="submit">
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;