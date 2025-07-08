import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { Notification, NotificationType } from '../entities/notification.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    const { content, parentId } = createCommentDto;

    let parent: Comment | null = null;
    if (parentId) {
      parent = await this.commentRepository.findOne({
        where: { id: parentId },
        relations: ['author'],
      });

      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }

      if (parent.isDeleted) {
        throw new BadRequestException('Cannot reply to a deleted comment');
      }
    }

    const comment = this.commentRepository.create({
      content,
      author,
      parentId: parent?.id,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Create notification for parent comment author
    if (parent && parent.author.id !== author.id) {
      const notification = this.notificationRepository.create({
        type: NotificationType.COMMENT_REPLY,
        message: `${author.username} replied to your comment`,
        userId: parent.author.id,
        commentId: savedComment.id,
      });

      await this.notificationRepository.save(notification);
    }

    return this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'parent', 'replies', 'replies.author'],
    }) as Promise<Comment>;
  }

  async getComments(
    page: number = 1,
    limit: number = 30,
  ): Promise<{ comments: Comment[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { parentId: undefined }, // Only root comments
      relations: [
        'author',
        'replies',
        'replies.author',
        'replies.replies',
        'replies.replies.author',
      ],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Filter out deleted comments that are past the restore window
    const filteredComments = comments.filter((comment) => {
      if (!comment.isDeleted) return true;
      return comment.canRestore;
    });

    return {
      comments: filteredComments,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCommentById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'parent', 'replies', 'replies.author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.getCommentById(id);

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    if (comment.isDeleted) {
      throw new BadRequestException('Cannot edit a deleted comment');
    }

    if (!comment.canEdit) {
      throw new BadRequestException('Edit window has expired (15 minutes)');
    }

    comment.content = updateCommentDto.content;
    comment.isEdited = true;

    return this.commentRepository.save(comment);
  }

  async deleteComment(id: string, user: User): Promise<Comment> {
    const comment = await this.getCommentById(id);

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    if (comment.isDeleted) {
      throw new BadRequestException('Comment is already deleted');
    }

    comment.isDeleted = true;
    comment.deletedAt = new Date();

    return this.commentRepository.save(comment);
  }

  async restoreComment(id: string, user: User): Promise<Comment> {
    const comment = await this.getCommentById(id);

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only restore your own comments');
    }

    if (!comment.isDeleted) {
      throw new BadRequestException('Comment is not deleted');
    }

    if (!comment.canRestore) {
      throw new BadRequestException('Restore window has expired (15 minutes)');
    }

    comment.isDeleted = false;
    comment.deletedAt = null;

    return this.commentRepository.save(comment);
  }

  async getReplies(parentId: string): Promise<Comment[]> {
    const parent = await this.getCommentById(parentId);

    return this.commentRepository.find({
      where: { parent: { id: parentId } },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'ASC' },
    });
  }
}
