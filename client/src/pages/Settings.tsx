export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">⚙️ 设置</h1>

      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">基础设置</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              数据刷新频率
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="30">每 30 分钟</option>
              <option value="60">每小时</option>
              <option value="120">每 2 小时</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Markdown 导出格式
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="md">Markdown (.md)</option>
              <option value="txt">纯文本 (.txt)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">关于</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>项目名称: 抖音热点分析器</p>
          <p>版本: 0.1.0</p>
          <p>技术栈: Node.js + Express + React</p>
        </div>
      </div>
    </div>
  );
}
