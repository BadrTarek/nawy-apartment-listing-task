
export interface IMediaRepository {
    /**
     * Upload multiple image files
     * @param files Array of image files to upload
     * @returns Promise containing array of URLs or file paths of the uploaded images
     */
    bulkUploadImage(files: Express.Multer.File[]): Promise<string[]>;
}
