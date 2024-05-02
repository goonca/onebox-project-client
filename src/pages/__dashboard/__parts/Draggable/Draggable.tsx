import { Button, CircularProgress, Link } from '@mui/material';
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

  const openSelector = () => {
    (
      document.querySelector(
        '#droppable input[type="file"]'
      ) as HTMLInputElement
    ).click();
  };

  const submitForm = async (files?: CustomFile[]) => {
    setUploading(true);
    const formData = new FormData();

    files = files ?? blobFiles ?? [];

    for (let i = 0; i < files.length; i++) {
      //if (!files[i].invalidMessage) {
      console.log(!files[i].invalidMessage?.length);
      !files[i].invalidMessage?.length && formData.append('files', files[i]);
      //};
    }
    await fetch('http://localhost:3002/files/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(res => {
      setTimeout(() => {
        props.onUpload && props.onUpload();
        setBlobFiles(undefined);
        setUploading(false);
      }, 1000);
    });
  };

  const onDrop = useCallback((allFiles: CustomFile[]) => {
    allFiles = allFiles.slice(0, 5);
    const acceptedFiles: CustomFile[] = [];
    //console.log(allFiles);
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
      //const rFile = reader.readAsArrayBuffer(file);
      acceptedFiles.push(file);
    });
    setBlobFiles(allFiles);
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

  const uploadAll = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await submitForm();
  };

  return (
    <>
      <div className={style['content']}>
        <div
          id="droppable"
          className={style['drop-area']}
          {...getRootProps()}
          onClick={e => {
            e.preventDefault();
          }}
        >
          <input {...getInputProps()} />
          {!blobFiles && (
            <div className={style['desc']}>
              <p>
                Drop some files here, or{' '}
                <Link onClick={() => openSelector()}>click here to select</Link>
              </p>
              <small>Max 5 files at time / 5Mb each</small>
            </div>
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
                {blobFiles.find(file => !file.invalidMessage?.length) && (
                  <LoadingButton
                    loading={uploading}
                    data-dark
                    size="small"
                    variant="contained"
                    onClick={async e => await uploadAll(e)}
                  >
                    Upload
                  </LoadingButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
