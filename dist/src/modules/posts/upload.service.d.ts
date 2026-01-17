export declare const uploadService: {
    uploadImage(file: Buffer, fileName: string, userId: string): Promise<{
        url: string;
        path: string;
    }>;
    uploadVideo(file: Buffer, fileName: string, userId: string): Promise<{
        url: string;
        path: string;
    }>;
    deleteFile(filePath: string): Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=upload.service.d.ts.map