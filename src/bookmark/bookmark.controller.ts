import { EditBookmark } from './dto/edit-bookmark.dto';
import { createBookmarkDto } from './dto/create-bookmark.dto';
import { Body, ParseIntPipe } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
// import { GetUser } from './decorator';
import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard'

import { GetUser } from './decorator';

import { STATUS_CODES } from 'http';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService)
    {}
    @Post()
    createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: createBookmarkDto
    ){
        return this.bookmarkService.createBookmark(userId, dto)
    }
    @Get('all')
    getBookmarks(@GetUser('id') userId: number){
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':id')
    getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe)bookmarkId: number
    ){}

    @Patch(':id')
    editBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe)bookmarkId: number,
        @Body() dto:EditBookmark
    ){
        return this.bookmarkService.editBookmarkById(userId, bookmarkId,dto)
    }

    @Delete(':id')
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe)bookmarkId: number
    ){
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)
    }
}
