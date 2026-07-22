import { HotTopic, Video, Creator } from '../types/index.js';
import { formatNumber, formatDateTime } from '../utils/format.js';

export const markdownService = {
  /**
   * 生成每日热点报告
   */
  generateDailyReport(topics: HotTopic[], videos: Video[], creators: Creator[]): string {
    const now = formatDateTime();
    const today = new Date().toISOString().split('T')[0];

    let md = `# 抖音热点日报 - ${today}\n\n`;

    // 数据概览
    md += `## 📊 数据概览\n\n`;
    md += `- 热搜话题: ${topics.length} 条\n`;
    md += `- 热门视频: ${videos.length} 个\n`;
    md += `- 热门创作者: ${creators.length} 位\n`;
    md += `- 更新时间: ${now}\n\n`;
    md += `---\n\n`;

    // 热搜话题
    md += `## 🔥 热搜话题 TOP 10\n\n`;
    if (topics.length > 0) {
      md += `| 排名 | 话题 | 热度值 |\n`;
      md += `|:---:|------|-------:|\n`;
      const topTopics = topics.slice(0, 10);
      for (const t of topTopics) {
        md += `| ${t.rank} | ${t.word} | ${formatNumber(t.hotValue)} |\n`;
      }
    } else {
      md += `_暂无数据_\n`;
    }
    md += `\n---\n\n`;

    // 热门视频
    md += `## 🎬 热门视频\n\n`;
    if (videos.length > 0) {
      const topVideos = videos.slice(0, 10);
      for (let i = 0; i < topVideos.length; i++) {
        const v = topVideos[i];
        md += `### ${i + 1}. ${v.title}\n\n`;
        md += `- **作者**: @${v.author?.nickname || '未知'}\n`;
        md += `- **点赞**: ${formatNumber(v.likes)} | **评论**: ${formatNumber(v.comments)} | **分享**: ${formatNumber(v.shares)}\n`;
        md += `- **链接**: https://www.douyin.com/video/${v.id}\n\n`;
      }
    } else {
      md += `_暂无数据_\n`;
    }
    md += `---\n\n`;

    // 热门创作者
    md += `## 👤 热门创作者\n\n`;
    if (creators.length > 0) {
      md += `| 排名 | 创作者 | 粉丝数 | 认证 |\n`;
      md += `|:---:|--------|-------:|:---:|\n`;
      const topCreators = creators.slice(0, 10);
      for (let i = 0; i < topCreators.length; i++) {
        const c = topCreators[i];
        md += `| ${i + 1} | @${c.nickname} | ${formatNumber(c.followers)} | ${c.verified ? '✅' : '❌'} |\n`;
      }
    } else {
      md += `_暂无数据_\n`;
    }
    md += `\n---\n\n`;

    // 底部信息
    md += `*由 Douyin Hot Spot Analyzer 自动生成*\n`;

    return md;
  },

  /**
   * 生成文件名前缀
   */
  getFilename(prefix = 'douyin-hotspot'): string {
    const today = new Date().toISOString().split('T')[0];
    return `${prefix}-${today}.md`;
  }
};
