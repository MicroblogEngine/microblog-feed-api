import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PUT, DELETE } from './route';
import { prisma } from '@/helpers/prisma';
import { randomUUID } from 'crypto';

// Mock prisma
vi.mock('@/helpers/prisma', () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Feed API [id] endpoints', () => {
  const id = randomUUID();

  const mockPost = {
    id,
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
    it('should return 400 if params are missing', async () => {
      
      const req = new Request(`http://localhost/api/feed/${id}`);
      const props = { params: undefined };

      const response = await GET(req, props);
      expect(response.status).toBe(400);
    });

    it('should return post if found', async () => {
      const req = new Request(`http://localhost/api/feed/${id}`);
      const props = { params: Promise.resolve({ id }) };

      vi.mocked(prisma.post.findUnique).mockResolvedValueOnce(mockPost);

      const response = await GET(req, props);
      const data = await response.json();
      data.createdAt = new Date(data.createdAt);
      data.updatedAt = new Date(data.updatedAt);

      expect(response.status).toBe(200);
      expect(data).toEqual(mockPost);
      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('PUT', () => {
    it('should return 400 if params are missing', async () => {
      const req = new Request(`http://localhost/api/feed/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' }),
      });
      const props = { params: undefined };

      const response = await PUT(req, props);
      expect(response.status).toBe(400);
    });

    it('should update post successfully', async () => {
      const updateData = { title: 'Updated Title' };
      const req = new Request(`http://localhost/api/feed/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const props = { params: Promise.resolve({ id }) };

      vi.mocked(prisma.post.update).mockResolvedValueOnce({ ...mockPost, ...updateData });

      const response = await PUT(req, props);

      expect(response.status).toBe(200);
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });
  });

  describe('DELETE', () => {
    it('should return 400 if params are missing', async () => {
      const req = new Request(`http://localhost/api/feed/${id}`, {
        method: 'DELETE',
      });
      const props = { params: undefined };

      const response = await DELETE(req, props);
      expect(response.status).toBe(400);
    });

    it('should delete post successfully', async () => {
      const req = new Request(`http://localhost/api/feed/${id}`, {
        method: 'DELETE',
      });
      const props = { params: Promise.resolve({ id }) };

      vi.mocked(prisma.post.delete).mockResolvedValueOnce(mockPost);

      const response = await DELETE(req, props);

      expect(response.status).toBe(200);
      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
}); 