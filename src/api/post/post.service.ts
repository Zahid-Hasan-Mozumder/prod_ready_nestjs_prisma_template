import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  async findAll(): Promise<[]> {
    return [];
  }

  async create(): Promise<{}> {
    return {};
  }
}
