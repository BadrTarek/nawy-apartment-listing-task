import { IMediaRepository } from "../../domain/interfaces/repositories/media-repository.interface";

export class MediaService {
    constructor(private readonly mediaRepository: IMediaRepository) { }

    async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
        return this.mediaRepository.bulkUploadImage(files);
    }
}
