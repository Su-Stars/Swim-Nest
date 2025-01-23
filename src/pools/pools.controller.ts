import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    SerializeOptions,
    UnauthorizedException,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { PoolsService } from './pools.service';
import { GetQueryData } from './dto/get-query-data.dto';
import { createPool } from './dto/createPool.dto';
import { Request } from 'express';
import { CoordinateApiService } from 'src/coordinate-api/coordinate-api.service';
import { JwtPayload } from "../auth/dto/jwt-payload";


@Controller('api/v1/pools')
export class PoolsController {
    constructor(
        private poolsService: PoolsService,
        private coordinateAPI: CoordinateApiService
    ) {}
    
    // 수영장 정보 조회

    @Get()
    @HttpCode(200)
    getAllPools(
        @Query() query: GetQueryData
    ): Promise<any> {
        return this.poolsService.getAllPools(query)
    }

    // 개별 수영장 조회
    @Get('/:poolId')
    @HttpCode(200)
    getByIdPool(
        @Param('poolId', ParseIntPipe) poolId: number
    ) {
        return this.poolsService.getByIdPool(poolId);
    }

    
    // 관리자 수영장 추가
    @Post()
    @HttpCode(200)
    async adminCreatePool(
        @Req() req: Request,
        @Body() body: createPool
    ) {
        return await this.poolsService.adminCreatePool(req, body)
    }
    
    // 관리자 수영장 수정
    @Patch('/:poolId')
    @HttpCode(200)
    async adminUpdatePool ( 
        @Req() req: Request,
        @Body() body: createPool,
        @Param('poolId', ParseIntPipe) poolId : number
    ) {
        return this.poolsService.adminUpdatePool(req, poolId, body)
    }

    // 로그인이 되어 있는 상태에서, 해당 수영장이 내가 북마크 한 수영장인지 확인하여 반환한다.
    @Get(":poolId/bookmarked")
    @HttpCode(HttpStatus.OK)
    async isBookmarked(@Param("poolId", ParseIntPipe) poolId : number, @Req() req : Request) {
        const jwtPayload : JwtPayload = req["user"];

        const {id} = jwtPayload;

        // null 이거나, { bookId : number, isBookMarked : boolean } 으로 반환되어 옴.
        const isMarkedObj = await this.poolsService.isBookmarked(id, poolId);

        return {
            status : "success",
            message : "북마크 되어 있습니다.",
            data : isMarkedObj
        }
    }


    // 관리자 수영장 삭제
    @Delete('/:poolId')
    @HttpCode(200)
    async adminDeletePool ( 
        @Req() req: Request,
        @Param('poolId', ParseIntPipe) poolId: number
    ) {
        return await this.poolsService.adminDeletePool(req, poolId);
    }
}

