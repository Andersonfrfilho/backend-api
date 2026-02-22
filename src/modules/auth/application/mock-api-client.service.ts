import { Inject, Injectable } from '@nestjs/common';

import { AUTHENTICATED_MOCK_API_PROVIDER } from '@modules/auth/infrastructure/providers/mock-api/authenticated.mock-api.provider.token';
import { MockApiProvider } from '@modules/shared/infrastructure/providers/mock-api/mock-api.provider';

/**
 * Mock API client service using authenticated HTTP provider
 */
@Injectable()
export class MockApiClientService {
  constructor(
    @Inject(AUTHENTICATED_MOCK_API_PROVIDER)
    private readonly mockApiProvider: MockApiProvider,
  ) {}

  /**
   * Get posts from mock API
   */
  async getPosts(): Promise<any> {
    const response = await this.mockApiProvider.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  }

  /**
   * Get a specific post
   */
  async getPost(id: number): Promise<any> {
    const response = await this.mockApiProvider.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    );
    return response.data;
  }

  /**
   * Create a new post
   */
  async createPost(data: { title: string; body: string; userId: number }): Promise<any> {
    const response = await this.mockApiProvider.post(
      'https://jsonplaceholder.typicode.com/posts',
      data,
    );
    return response.data;
  }

  /**
   * Update a post
   */
  async updatePost(id: number, data: { title?: string; body?: string }): Promise<any> {
    const response = await this.mockApiProvider.patch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete a post
   */
  async deletePost(id: number): Promise<any> {
    const response = await this.mockApiProvider.patch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {},
    );
    return response.data;
  }
}
