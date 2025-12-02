import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    findAll(): Promise<[]> {
        return this.userService.findAll();
    }

    @Post()
    create(): Promise<{}> {
        return this.userService.create();
    }
}
