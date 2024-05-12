export type FileProps = {
  readableSize: (fileSizeInBytes: number) => string;
};

export const useFile = (): FileProps => {
  const readableSize = (fileSizeInBytes: number) => {
    let i = -1;
    const byteUnits = [' kb', ' mb'];
    do {
      fileSizeInBytes /= 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  };

  return {
    readableSize
  };
};
