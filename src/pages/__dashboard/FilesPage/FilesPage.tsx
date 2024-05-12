import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFile } from 'shared/hooks/useFile';
import { useMoment } from 'shared/hooks/useMoment';
import { useServices } from 'shared/hooks/useServices';
import { FileModel } from 'shared/types/api-type';

import { Draggable } from '../__parts/Draggable/Draggable';
import style from './FilesPage.module.scss';

export const FilesPage = () => {
  const { getFiles, deleteFile } = useServices();
  const [files, setFiles] = useState<FileModel[]>();
  const { toDateTimeString } = useMoment();
  const { readableSize } = useFile();

  const listFiles = async () => {
    const files = await getFiles();
    setFiles(files.data);
  };

  const removeFile = async (id: number) => {
    await deleteFile(id).then(() => {
      listFiles();
    });
  };

  useEffect(() => {
    listFiles();
  }, []);

  const onUpload = () => {
    listFiles();
  };

  return (
    <>
      <div className={style['files-page']}>
        <div className={style['header']}>
          <div>
            <h2>Files</h2>
          </div>
        </div>
        <Draggable onUpload={() => onUpload()} showPreview={false} />
        <div className={style['content']}>
          {files &&
            files.map(file => {
              return (
                <div className={style['tile']} key={file.id}>
                  <img
                    width={200}
                    src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${file.originalname}`}
                  />
                  <p className={style['name']}>{file.originalname}</p>
                  <div>
                    <p className={style['size']}>
                      {readableSize(file.size as number)}
                    </p>
                  </div>
                  <p className={style['date']}>
                    {toDateTimeString(file.createdAt)}
                  </p>
                  <div className={style['fix-height']}></div>
                  <Button
                    variant="outlined"
                    onClick={async () => await removeFile(file.id as number)}
                  >
                    Delete
                  </Button>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
