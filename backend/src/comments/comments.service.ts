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
      relations: ['author', 'parent'],
    }) as Promise<Comment>;
  }

  async getComments(
    page: number = 1,
    limit: number = 30,
  ): Promise<{ comments: Comment[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { parentId: IsNull() }, // Only root comments
      relations: ['author'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Load replies recursively with unlimited nesting
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        comment.replies = await this.loadRepliesRecursively(comment.id);
        return comment;
      })
    );

    // Filter out deleted comments that are past the restore window
    const filteredComments = commentsWithReplies.filter((comment) => {
      if (!comment.isDeleted) return true;
      return comment.canRestore;
    });

    return {
      comments: filteredComments,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Recursively load all replies for a comment (unlimited nesting)
   */
  private async loadRepliesRecursively(parentId: string): Promise<Comment[]> {
    const replies = await this.commentRepository.find({
      where: { parentId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });

    // Load nested replies for each reply
    for (const reply of replies) {
      reply.replies = await this.loadRepliesRecursively(reply.id);
    }

    return replies;
  }

  async getCommentById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Load replies recursively
    comment.replies = await this.loadRepliesRecursively(comment.id);

    return comment;
  }

  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

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
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

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
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

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
    const parent = await this.commentRepository.findOne({
      where: { id: parentId },
      relations: ['author'],
    });

    if (!parent) {
      throw new NotFoundException('Parent comment not found');
    }

    return this.loadRepliesRecursively(parentId);
  }
}