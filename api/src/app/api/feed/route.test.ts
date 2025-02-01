import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { prisma } from '@/helpers/prisma';
import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

// Mock prisma
vi.mock('@/helpers/prisma', () => ({
  prisma: {
    post: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('Feed API endpoints', () => {
  const mockPost = {
    id: randomUUID(),
    title: 'Test Post',
    content: 'Test Content',
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true,
    text: 'Test Text',
    profileId: randomUUID(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all posts', async () => {
      const mockPosts = [mockPost, { ...mockPost, id: randomUUID() }];
      vi.mocked(prisma.post.findMany).mockResolvedValueOnce(mockPosts);

      const response = await GET();
      const data = await response.json();
      
      // Convert ISO date strings back to Date objects for comparison
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((post: any) => {
        post.createdAt = new Date(post.createdAt);
        post.updatedAt = new Date(post.updatedAt);
      });

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPosts);
      expect(prisma.post.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no posts exist', async () => {
      vi.mocked(prisma.post.findMany).mockResolvedValueOnce([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
      expect(prisma.post.findMany).toHaveBeenCalled();
    });
  });

  describe('POST', () => {
    it('should create a new post successfully', async () => {
      const newPostData = {
        title: 'New Post',
        content: 'New Content',
        text: 'New Text',
        published: true,
        profileId: randomUUID(),
      };

      const req = new NextRequest('http://localhost/api/feed', {
        method: 'POST',
        body: JSON.stringify(newPostData),
      });

      vi.mocked(prisma.post.create).mockResolvedValueOnce({
        ...newPostData,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: newPostData,
      });
    });

    it('should handle invalid JSON in request body', async () => {
      const req = new NextRequest('http://localhost/api/feed', {
        method: 'POST',
        body: 'invalid-json',
      });

      await expect(POST(req)).rejects.toThrow();
    });
  });
}); 