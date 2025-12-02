import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async findAll(): Promise<[]> {
    return [];
  }

  async create(): Promise<{}> {
    return {};
  }
}
