import { IMediaRepository } from '../../domain/interfaces/repositories/media-repository.interface';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export class LocalMediaRepository implements IMediaRepository {
    private readonly uploadDir: string;
    private readonly baseUrl: string;

    constructor(uploadDir: string, baseUrl: string) {
        this.uploadDir = uploadDir;
        this.baseUrl = baseUrl;
    }

    private async ensureUploadDirExists(): Promise<void> {
        try {
            await fs.access(this.uploadDir);
        } catch {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    }

    private generateUniqueFileName(originalName: string): string {
        const timestamp = Date.now();
        const hash = createHash('md5')
            .update(`${originalName}${timestamp}`)
            .digest('hex')
            .slice(0, 8);
        const ext = path.extname(originalName);
        return `${hash}-${timestamp}${ext}`;
    }

    private async uploadImage(file: Express.Multer.File): Promise<string> {
        await this.ensureUploadDirExists();
        const fileName = this.generateUniqueFileName(file.originalname);
        const filePath = path.join(this.uploadDir, fileName);
        await fs.writeFile(filePath, file.buffer);
        return `${this.baseUrl.replace(/\/$/, '')}/${this.uploadDir.replace(/\/$/, '')}/${fileName}`;
    }

    async bulkUploadImage(files: Express.Multer.File[]): Promise<string[]> {
        return Promise.all(files.map(file => this.uploadImage(file)));
    }
}
