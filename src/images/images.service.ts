import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { Repository } from 'typeorm';
import { Images } from './images.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagesService {
    s3Client: S3Client;

    constructor(
        @InjectRepository(Images)
        private ImagesRepository: Repository<Images>,
        private configService: ConfigService,
    ) {
        this.s3Client = new S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
            }
        })
    }

    async uploadImages (file: Express.Multer.File) {
        const { size, mimetype, buffer } = file;
        const type = ['image/png', 'image/jpeg', 'image/gif']
        const ext = path.extname(file.originalname);

        // 임시 방편
        const placeId = Math.floor(Math.random()*10);

        if (!type.some(i => i === mimetype)) {
            throw new UnsupportedMediaTypeException("png, jpg, gif 파일이 아닙니다.");
        }

        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Key: `image-${placeId}${ext}`,
            Body: buffer,
            ContentType: `image/${ext}`
        })

        const result = await this.s3Client.send(command);

        if (result.$metadata.httpStatusCode === 200) {
            const data = {
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
                d,
                size: size,
                mimetype: mimetype
            }
            
            console.log(await this.ImagesRepository.insert(data))
        }
    }

    
}

