import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PostDetailModal = ({ post, isOpen, onClose, onBookmark, onHelpful }) => {
  const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarked || false);
  const [isHelpful, setIsHelpful] = useState(post?.isHelpfulByUser || false);
  const [helpfulCount, setHelpfulCount] = useState(post?.helpfulCount || 0);

  if (!isOpen || !post) return null;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post?.id, !isBookmarked);
  };

  const handleHelpful = () => {
    const newHelpfulState = !isHelpful;
    setIsHelpful(newHelpfulState);
    setHelpfulCount(prev => newHelpfulState ? prev + 1 : prev - 1);
    onHelpful?.(post?.id, newHelpfulState);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="fixed inset-0 z-500 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Post Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Author Info */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Image
                  src={post?.author?.avatar}
                  alt={post?.author?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-foreground">{post?.author?.name}</h4>
                    {post?.author?.verified && (
                      <Icon name="BadgeCheck" size={16} className="text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{post?.author?.role}</p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(post?.timestamp)}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <Icon 
                  name={isBookmarked ? "Bookmark" : "BookmarkPlus"} 
                  size={20} 
                  className={isBookmarked ? "text-primary" : "text-muted-foreground"} 
                />
              </Button>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-foreground mb-4">{post?.title}</h1>
              
              {post?.image && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={post?.image}
                    alt={post?.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {post?.fullContent || post?.content}
                </p>
              </div>
            </div>

            {/* Market Data */}
            {post?.type === 'market-rates' && post?.marketData && (
              <div className="bg-surface rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Current Market Rates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post?.marketData?.map((item, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item?.product}</p>
                          <p className="text-sm text-muted-foreground">{item?.unit || 'per piece'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">₹{item?.price}</p>
                          <p className={`text-sm ${item?.change > 0 ? 'text-success' : item?.change < 0 ? 'text-error' : 'text-muted-foreground'}`}>
                            {item?.change > 0 ? '+' : ''}{item?.change}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {post?.tags && post?.tags?.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {post?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="Eye" size={18} />
                  <span className="text-sm">{post?.views} views</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleHelpful}
                  className={`flex items-center space-x-2 ${isHelpful ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <Icon name="ThumbsUp" size={18} />
                  <span className="text-sm">{helpfulCount} helpful</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Share2" size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;