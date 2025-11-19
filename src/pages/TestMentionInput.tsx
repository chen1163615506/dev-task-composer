import React, { useState } from 'react';
import MentionInput, { UploadedFile } from '@/components/MentionInput';

const TestMentionInput: React.FC = () => {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = (newFiles: UploadedFile[]) => {
    console.log('上传的文件:', newFiles);
    setFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">MentionInput 文件上传测试</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">基本功能测试</h2>
          <MentionInput
            value={value}
            onChange={setValue}
            onFileUpload={handleFileUpload}
            placeholder="输入 @ 来提及资源，或直接拖拽/粘贴图片文件..."
            rows={6}
            allowFileUpload={true}
            maxFileSize={10}
            acceptedFileTypes={['image/*', '.pdf', '.doc', '.docx', '.txt', '.md']}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">当前输入内容</h2>
          <div className="p-4 bg-gray-100 rounded-md">
            <pre className="whitespace-pre-wrap text-sm">{value || '(空)'}</pre>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">已上传的文件 ({files.length})</h2>
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map(file => (
                <div key={file.id} className="p-3 bg-blue-50 rounded-md">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-600">
                    类型: {file.type} | 大小: {(file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无上传文件</p>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-md">
          <h3 className="font-semibold text-yellow-800 mb-2">测试说明</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 输入 @ 符号可以触发提及菜单</li>
            <li>• 可以拖拽文件到输入框进行上传</li>
            <li>• 可以粘贴图片（Ctrl+V）</li>
            <li>• 点击"上传文件"按钮选择文件</li>
            <li>• 支持图片预览和文件下载</li>
            <li>• 鼠标悬停文件项可看到操作按钮</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestMentionInput;