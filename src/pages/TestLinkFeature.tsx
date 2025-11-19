import { useState } from 'react';
import CreateKnowledgeModal from '../components/CreateKnowledgeModal';
import { Button } from '../components/ui/button';
import { KnowledgeItem } from '../types/knowledge';

export default function TestLinkFeature() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (knowledge: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('保存的知识库数据:', knowledge);
    alert('知识库创建成功！请查看控制台输出。');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">测试链接转换功能</h1>

      <div className="space-y-4">
        <p className="text-gray-600">
          点击下面的按钮打开知识库创建对话框，然后在"从链接创建"部分输入一个网页链接测试功能。
        </p>

        <p className="text-sm text-gray-500">
          推荐测试链接：
        </p>
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>https://www.baidu.com</li>
          <li>https://github.com</li>
          <li>https://stackoverflow.com</li>
        </ul>

        <Button onClick={() => setIsModalOpen(true)} className="mt-4">
          打开知识库创建对话框
        </Button>
      </div>

      <CreateKnowledgeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}