import { useState, useEffect } from 'react';
import { api } from '../api/client';

export function Settings() {
  const [schedulerRunning, setSchedulerRunning] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchedulerStatus();
  }, []);

  const loadSchedulerStatus = async () => {
    try {
      const res = await api.getSchedulerStatus();
      if (res.success && res.data) {
        setSchedulerRunning(res.data.running);
      }
    } catch (error) {
      console.error('获取定时任务状态失败:', error);
    }
  };

  const handleToggleScheduler = async () => {
    setLoading(true);
    try {
      if (schedulerRunning) {
        await api.stopScheduler();
        setSchedulerRunning(false);
      } else {
        await api.startScheduler(refreshInterval * 60 * 1000);
        setSchedulerRunning(true);
      }
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">⚙️ 设置</h1>

      {/* 定时刷新设置 */}
      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">⏰ 定时刷新</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">自动刷新热点数据</p>
              <p className="text-sm text-gray-500">
                {schedulerRunning ? '定时任务运行中' : '定时任务已停止'}
              </p>
            </div>
            <button
              onClick={handleToggleScheduler}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                schedulerRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? '处理中...' : schedulerRunning ? '⏹️ 停止' : '▶️ 启动'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              刷新间隔
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              disabled={schedulerRunning}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value={15}>每 15 分钟</option>
              <option value={30}>每 30 分钟</option>
              <option value={60}>每 1 小时</option>
              <option value={120}>每 2 小时</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              提示：修改间隔需要在停止定时任务后生效
            </p>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">💾 数据管理</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">手动刷新数据</p>
              <p className="text-sm text-gray-500">立即从抖音获取最新热点数据</p>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              🔄 前往首页刷新
            </a>
          </div>
        </div>
      </div>

      {/* 关于 */}
      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ 关于</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>项目名称: 抖音热点分析器</p>
          <p>版本: 1.1.0</p>
          <p>技术栈: Node.js + Express + React</p>
          <p>数据来源: 抖音热搜 API</p>
        </div>
      </div>
    </div>
  );
}
