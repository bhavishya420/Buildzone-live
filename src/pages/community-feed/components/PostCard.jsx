import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PostCard = ({ post, onPostClick, onBookmark, onHelpful }) => {
  const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarked || false);
  const [isHelpful, setIsHelpful] = useState(post?.isHelpfulByUser || false);
  const [helpfulCount, setHelpfulCount] = useState(post?.helpfulCount || 0);

  const handleBookmark = (e) => {
    e?.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post?.id, !isBookmarked);
  };

  const handleHelpful = (e) => {
    e?.stopPropagation();
    const newHelpfulState = !isHelpful;
    setIsHelpful(newHelpfulState);
    setHelpfulCount(prev => newHelpfulState ? prev + 1 : prev - 1);
    onHelpful?.(post?.id, newHelpfulState);
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'market-rates': return 'TrendingUp';
      case 'tips': return 'Lightbulb';
      case 'product-spotlight': return 'Star';
      case 'industry-news': return 'Newspaper';
      default: return 'MessageSquare';
    }
  };

  const getPostTypeColor = (type) => {
    switch (type) {
      case 'market-rates': return 'text-success bg-success/10';
      case 'tips': return 'text-warning bg-warning/10';
      case 'product-spotlight': return 'text-accent bg-accent/10';
      case 'industry-news': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-soft transition-smooth"
      onClick={() => onPostClick?.(post)}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <Image
            src={post?.author?.avatar}
            alt={post?.author?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-foreground truncate">
                {post?.author?.name}
              </h4>
              {post?.author?.verified && (
                <Icon name="BadgeCheck" size={16} className="text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{post?.author?.role}</span>
              <span>•</span>
              <span>{formatTimeAgo(post?.timestamp)}</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          className="flex-shrink-0"
        >
          <Icon 
            name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
            size={18} 
            className={isBookmarked ? "text-primary" : "text-muted-foreground"} 
          />
        </Button>
      </div>
      {/* Post Type Badge */}
      <div className="flex items-center space-x-2 mb-3">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post?.type)}`}>
          <Icon name={getPostTypeIcon(post?.type)} size={12} />
          <span>{post?.typeLabel}</span>
        </div>
        {post?.location && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="MapPin" size={12} />
            <span>{post?.location}</span>
          </div>
        )}
      </div>
      {/* Post Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {post?.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post?.content}
        </p>
      </div>
      {/* Post Image */}
      {post?.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Image
            src={post?.image}
            alt={post?.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      {/* Market Rate Data */}
      {post?.type === 'market-rates' && post?.marketData && (
        <div className="bg-surface rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {post?.marketData?.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-muted-foreground">{item?.product}</p>
                <p className="font-semibold text-foreground">₹{item?.price}</p>
                <p className={`text-xs ${item?.change > 0 ? 'text-success' : item?.change < 0 ? 'text-error' : 'text-muted-foreground'}`}>
                  {item?.change > 0 ? '+' : ''}{item?.change}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Post Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Icon name="Eye" size={16} />
            <span>{post?.views}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpful}
            className={`flex items-center space-x-1 ${isHelpful ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon name="ThumbsUp" size={16} />
            <span className="text-sm">{helpfulCount}</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Icon name="Share2" size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Icon name="MoreHorizontal" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;