import React, { useState } from 'react';
import { Search, User, Clock, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
}

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const tagMap: Record<string, string> = {
    'ALL': 'Tất cả',
    'Cloud Security': 'Bảo mật Cloud',
    'DevOps': 'DevOps & CI/CD',
    'Infrastructure': 'Cơ cơ hạ tầng',
    'SaaS Architecture': 'Kiến trúc SaaS'
  };

  const tags = ['ALL', 'Cloud Security', 'DevOps', 'Infrastructure', 'SaaS Architecture'];

  const posts: BlogPost[] = [
    {
      id: 'post-1',
      title: 'Thiết kế Kế hoạch khôi phục sau thảm họa (DR): Triển khai Đa vùng Active-Active',
      excerpt: 'Cách chúng tôi cấu hình AWS Aurora Global Databases và các chính sách định tuyến Route 53 để đạt được thời gian khôi phục sự cố (RTO) dưới 1 phút giữa các vùng địa lý.',
      date: '2026-06-15',
      author: 'Nguyễn Thanh Tâm',
      readTime: '6 phút đọc',
      category: 'Infrastructure',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'post-2',
      title: 'Loại bỏ VPN truyền thống: Bảo mật kết nối từ xa với Cloudflare Zero Trust',
      excerpt: 'Hành trình thực tế di trú mạng làm việc từ xa cho 1200 kỹ sư sang mô hình xác thực danh tính liên tục, giảm 40% chi phí lưu lượng mạng và cải thiện hiệu suất kết nối.',
      date: '2026-05-28',
      author: 'Nguyễn Thanh Tâm',
      readTime: '5 phút đọc',
      category: 'Cloud Security',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'post-3',
      title: 'Tự động tuân thủ bảo mật: Tích hợp quét lỗ hổng Trivy và SonarQube vào GitLab Runner',
      excerpt: 'Ngăn chặn các bản phát hành có lỗi bảo mật trước khi đẩy lên môi trường Staging. Hướng dẫn chi tiết thiết lập rào chắn ngăn commit chứa thông tin mật hoặc thư viện lỗi thời.',
      date: '2026-04-10',
      author: 'Nguyễn Thanh Tâm',
      readTime: '8 phút đọc',
      category: 'DevOps',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop'
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'ALL' || post.category === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Blog Kỹ thuật & Thiết kế Hệ thống
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Bài viết chuyên sâu phân tích thực tế về di trú đám mây, thiết kế mạng biên, tự động hóa CI/CD và an toàn thông tin doanh nghiệp.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 focus:outline-none text-slate-900 dark:text-white"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedTag === tag
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white dark:bg-slate-955 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {tagMap[tag]}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-550">
            Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200/50 dark:border-slate-800/50 h-full"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-200/40 dark:border-slate-800/40">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    <span>{tagMap[post.category] || post.category}</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-0.5" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 hover:text-brand-500 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
                  <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-slate-555 dark:text-slate-450">
                    <User className="h-3.5 w-3.5" />
                    <span>{post.author}</span>
                  </div>
                  <button className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center">
                    <span>Chi tiết bài viết</span>
                    <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

    </div>
  );
};

export default BlogPage;
