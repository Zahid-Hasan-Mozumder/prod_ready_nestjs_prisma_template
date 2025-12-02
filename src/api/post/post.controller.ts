import { Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(): Promise<[]> {
    return this.postService.findAll();
  }

  @Post()
  create(): Promise<{}> {
    return this.postService.create();
  }
}
