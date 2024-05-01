import { Link } from '@mui/material';
import style from './FilesPage.module.scss';
import { FileModel } from 'shared/types/api-type';
import { useServices } from 'shared/hooks/useServices';
import { useEffect, useRef, useState } from 'react';
import { useMoment } from 'shared/hooks/useMoment';
import { Draggable } from '../__parts/Draggable/Draggable';
import { useFile } from 'shared/hooks/useFile';

export const FilesPage = () => {
  const dragAreRef = useRef<HTMLDivElement>(null);
  const { getFiles } = useServices();
  const [files, setFiles] = useState<FileModel[]>();
  const { toDateTimeString } = useMoment();
  const { readableSize } = useFile();

  const listFiles = async () => {
    const files = await getFiles();
    setFiles(files.data);
  };

  useEffect(() => {
    listFiles();
  }, []);

  return (
    <>
      <div className={style['files-page']}>
        <div className={style['header']}>
          <div>
            <h2>Files</h2>
          </div>
        </div>
        <Draggable />
        <div className={style['content']}>
          {files &&
            files.map(file => {
              return (
                <div className={style['tile']}>
                  <img
                    width={200}
                    src={`http://localhost:3002/files/${file.originalname}`}
                  />
                  <p className={style['name']}>{file.originalname}</p>
                  <p className={style['size']}>
                    {readableSize(file.size as number)}
                  </p>
                  <p className={style['date']}>
                    {toDateTimeString(file.createdAt)}
                  </p>
                  <Link>Delete</Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
