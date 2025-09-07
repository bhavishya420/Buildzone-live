import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TrendingSidebar = ({ trendingTopics, popularPosts, onTopicClick, onPostClick }) => {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Trending Topics</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics?.map((topic, index) => (
            <button
              key={topic?.id}
              onClick={() => onTopicClick?.(topic)}
              className="w-full text-left p-3 rounded-lg hover:bg-surface transition-smooth"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">#{topic?.tag}</p>
                  <p className="text-xs text-muted-foreground">{topic?.posts} posts</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-primary">#{index + 1}</span>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Popular Posts */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Star" size={20} className="text-accent" />
          <h3 className="font-semibold text-foreground">Popular This Week</h3>
        </div>
        <div className="space-y-4">
          {popularPosts?.map((post) => (
            <button
              key={post?.id}
              onClick={() => onPostClick?.(post)}
              className="w-full text-left p-3 rounded-lg hover:bg-surface transition-smooth"
            >
              <div className="flex items-start space-x-3">
                <Image
                  src={post?.author?.avatar}
                  alt={post?.author?.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                    {post?.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{post?.author?.name}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="ThumbsUp" size={12} />
                      <span>{post?.helpfulCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Icon name="BookmarkPlus" size={16} className="mr-2" />
            View Bookmarks
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Bell" size={16} className="mr-2" />
            Notifications
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Settings" size={16} className="mr-2" />
            Feed Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;