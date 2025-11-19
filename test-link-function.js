// 测试链接转换功能
import { isValidUrl, detectUrlsInText } from '../src/utils/linkToMarkdown';

// 测试URL验证
console.log('测试URL验证:');
console.log('https://example.com ->', isValidUrl('https://example.com')); // 应该返回true
console.log('http://example.com ->', isValidUrl('http://example.com')); // 应该返回true
console.log('example.com ->', isValidUrl('example.com')); // 应该返回false
console.log('ftp://example.com ->', isValidUrl('ftp://example.com')); // 应该返回false

// 测试URL检测
console.log('\n测试URL检测:');
const text1 = '这是一个包含链接的文本 https://example.com 和另一个链接 http://test.com';
console.log('文本:', text1);
console.log('检测到的URLs:', detectUrlsInText(text1));

const text2 = '没有链接的文本';
console.log('文本:', text2);
console.log('检测到的URLs:', detectUrlsInText(text2));

console.log('\n功能测试完成！');