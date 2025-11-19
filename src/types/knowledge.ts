export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'my' | 'shared' | 'market';
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  gitBound: boolean;
  gitRepo?: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  permission?: 'edit' | 'view' | 'owner';
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  items: KnowledgeItem[];
}

export interface KnowledgeStore {
  myKnowledge: KnowledgeItem[];
  sharedKnowledge: {
    created: KnowledgeItem[];
    added: KnowledgeItem[];
  };
  marketKnowledge: KnowledgeItem[];
}