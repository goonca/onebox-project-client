import { Button } from '@mui/material';
import style from './Draggable.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFile } from 'shared/hooks/useFile';
import { LoadingButton } from '@mui/lab';

export type DraggableProps = {
  onUpload: () => void;
};

type CustomFile = File & {
  invalidMessage?: string[];
};

export const Draggable: React.FC<DraggableProps> = props => {
  const [blobFiles, setBlobFiles] = useState<CustomFile[]>();
  const [uploading, setUploading] = useState<boolean>(false);
  const { readableSize } = useFile();

  const submitForm = () => {
    setUploading(true);
    const formData = new FormData();

    blobFiles
      ?.filter(file => !file.invalidMessage)
      .forEach(file => {
        formData.append('files', file);
      });

    fetch('http://localhost:3002/files/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(res => {
      props.onUpload && props.onUpload();
      setBlobFiles(undefined);
      setUploading(false);
    });
  };

  const onDrop = useCallback((allFiles: CustomFile[]) => {
    allFiles = allFiles.slice(0, 5);
    const acceptedFiles: CustomFile[] = [];
    console.log(allFiles);
    //submitForm(acceptedFiles);
    //setBlobFiles(allFiles);
    allFiles.map(file => {
      file.invalidMessage = [];
      file.size > 1024 * 1024 * 5 && file.invalidMessage.push('too big');

      !file.type.startsWith('image') &&
        file.invalidMessage.push('not an image');

      return file;
    });

    allFiles.forEach((file: CustomFile) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        /*const binaryStr = reader.result;
        console.log('binaryStr', binaryStr);*/
      };
      const rFile = reader.readAsArrayBuffer(file);
      acceptedFiles.push(file);
      console.log(file);
    });
    setBlobFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const ele = document.getElementById('droppable') as HTMLDivElement;

    ele.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    ele.addEventListener('dragenter', function (e) {
      e.preventDefault();
      ele.classList.add(style['dragging']);
    });

    ele.addEventListener('dragleave', function (e) {
      e.preventDefault();
      ele.classList.remove(style['dragging']);
    });

    ele.addEventListener('drop', function (e) {
      e.preventDefault();
      ele.classList.remove(style['dragging']);
    });
  }, []);

  const cancelUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setBlobFiles(undefined);
  };

  const uploadAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    submitForm();
  };

  return (
    <>
      <div className={style['content']}>
        <div id="droppable" className={style['drop-area']} {...getRootProps()}>
          <input {...getInputProps()} />
          {!blobFiles && (
            <span>Drop some files here, or click to select them</span>
          )}
          <div className={style['uploaded-files']}>
            {blobFiles?.map((file: CustomFile) => {
              return (
                <div key={file.name} className={style['file']}>
                  {file.name}{' '}
                  <span className={style['size']}>
                    {readableSize(file.size)}
                  </span>
                  {file.invalidMessage?.map(message => {
                    return (
                      <span className={style['invalid-message']}>
                        {message}
                      </span>
                    );
                  })}
                </div>
              );
            })}
            {blobFiles && (
              <div className={style['footer']}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={e => cancelUpload(e)}
                >
                  Cancel
                </Button>
                <LoadingButton
                  loading={uploading}
                  data-dark
                  size="small"
                  variant="contained"
                  onClick={e => uploadAll(e)}
                >
                  Upload
                </LoadingButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
