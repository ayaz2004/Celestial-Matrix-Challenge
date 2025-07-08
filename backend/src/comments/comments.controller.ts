import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { User } from '../entities/user.entity';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.createComment(createCommentDto, user);
  }

  @Get()
  async getComments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
  ) {
    return this.commentsService.getComments(Number(page), Number(limit));
  }

  @Get(':id')
  async getCommentById(@Param('id') id: string) {
    return this.commentsService.getCommentById(id);
  }

  @Get(':id/replies')
  async getReplies(@Param('id') id: string) {
    return this.commentsService.getReplies(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateComment(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.updateComment(id, updateCommentDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(@Param('id') id: string, @GetUser() user: User) {
    return this.commentsService.deleteComment(id, user);
  }

  @Post(':id/restore')
  @UseGuards(AuthGuard('jwt'))
  async restoreComment(@Param('id') id: string, @GetUser() user: User) {
    return this.commentsService.restoreComment(id, user);
  }
}
