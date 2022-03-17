import { EditBookmark } from './dto/edit-bookmark.dto';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { EditUserDto } from './../user/dto/edit-user.dto';
import { createBookmarkDto } from './dto/create-bookmark.dto';
import { PrismaClient } from '@prisma/client';
import { GetUser } from './../auth/decorator/get-user.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}
 
    async createBookmark(userId: number, dto: createBookmarkDto){
      const bookmark =  await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto
            }
        })

        return bookmark;
    }

   async getBookmarks(userId: number){
    const bookmarks = await this.prisma.bookmark.findMany({
        where: {
            userId: userId
        }
    })
    return bookmarks
    }

    getBookmarkById(userId: number, bookmarkId: number){}

    async editBookmarkById(userId: number, bookmarkId: number,dto: EditBookmark){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id : bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId){
            throw new ForbiddenException(
                'Access to resources denied'
            )
        }
        const updatedBookmark = await this.prisma.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }
        })

        return updatedBookmark
    }

    async deleteBookmarkById(userId: number, bookmarkId: number){
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id : bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId){
            throw new ForbiddenException(
                'Access to resources denied'
            )
        }
        const deletedBookmark = await this.prisma.bookmark.delete({
            where: {
                id : bookmarkId,

            },
        })

        return deletedBookmark
    }
}
